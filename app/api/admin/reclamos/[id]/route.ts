import { NextRequest, NextResponse } from "next/server";
import { createAuditLog } from "@/lib/security/audit";
import { getClientIp, getUserAgent } from "@/lib/security/request";
import { getServerAccessContext } from "@/lib/security/auth";
import { sanitizeMultilineText } from "@/lib/security/sanitize";
import { createServiceRoleClient } from "@/lib/supabase/server";
import type { ReclamoEstado, ReclamoPrioridad, Reclamo } from "@/types/database";

const ESTADOS_VALIDOS = new Set<ReclamoEstado>([
  "pendiente",
  "en_proceso",
  "resuelto",
  "rechazado",
  "cerrado",
]);

const PRIORIDADES_VALIDAS = new Set<ReclamoPrioridad>([
  "baja",
  "media",
  "alta",
  "urgente",
]);

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const ip = getClientIp(request);
  const userAgent = getUserAgent(request);

  const { user, role, profile } = await getServerAccessContext();

  if (!user || !role) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await request.json();

  const estado =
    typeof body.estado === "string" && ESTADOS_VALIDOS.has(body.estado as ReclamoEstado)
      ? (body.estado as ReclamoEstado)
      : undefined;

  const prioridad =
    typeof body.prioridad === "string" &&
    PRIORIDADES_VALIDAS.has(body.prioridad as ReclamoPrioridad)
      ? (body.prioridad as ReclamoPrioridad)
      : undefined;

  const observaciones =
    typeof body.observaciones === "string"
      ? (sanitizeMultilineText(body.observaciones, 2000) || null)
      : undefined;

  if (!estado && !prioridad && observaciones === undefined) {
    return NextResponse.json({ error: "No hay campos válidos para actualizar." }, { status: 400 });
  }

  const service = createServiceRoleClient();

  const { data: reclamoActual } = await service
    .from("reclamos")
    .select("estado, prioridad")
    .eq("id", id)
    .single();

  if (!reclamoActual) {
    return NextResponse.json({ error: "Reclamo no encontrado." }, { status: 404 });
  }

  const updates: Partial<Pick<Reclamo, "estado" | "prioridad" | "observaciones_internas">> = {};
  if (estado) updates.estado = estado;
  if (prioridad) updates.prioridad = prioridad;
  if (observaciones !== undefined) updates.observaciones_internas = observaciones;

  const { error: updateError } = await service
    .from("reclamos")
    .update(updates)
    .eq("id", id);

  if (updateError) {
    return NextResponse.json({ error: "No se pudieron guardar los cambios." }, { status: 500 });
  }

  // Registrar cambio de estado en historial
  if (estado && estado !== reclamoActual.estado) {
    await service.from("historial_estados").insert({
      reclamo_id: id,
      estado_anterior: reclamoActual.estado,
      estado_nuevo: estado,
      comentario: null,
      usuario_id: user.id,
    });

    await createAuditLog({
      userId: user.id,
      accion: "estado_cambiado",
      entidad: "reclamos",
      entidadId: id,
      detalle: {
        estado_anterior: reclamoActual.estado,
        estado_nuevo: estado,
        admin_nombre: profile?.nombre ?? user.email,
      },
      ip,
      userAgent,
    });
  }

  await createAuditLog({
    userId: user.id,
    accion: "reclamo_updated",
    entidad: "reclamos",
    entidadId: id,
    detalle: { ...updates, role },
    ip,
    userAgent,
  });

  return NextResponse.json({ success: true });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const ip = getClientIp(request);
  const userAgent = getUserAgent(request);

  const { user, role, profile } = await getServerAccessContext();

  if (!user || role !== "super_admin") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const service = createServiceRoleClient();

  const { data: reclamo } = await service
    .from("reclamos")
    .select("id, numero_seguimiento")
    .eq("id", id)
    .single();

  if (!reclamo) {
    return NextResponse.json({ error: "Reclamo no encontrado." }, { status: 404 });
  }

  const { error: deleteError } = await service
    .from("reclamos")
    .delete()
    .eq("id", id);

  if (deleteError) {
    return NextResponse.json({ error: "No se pudo eliminar el reclamo." }, { status: 500 });
  }

  await createAuditLog({
    userId: user.id,
    accion: "reclamo_eliminado",
    entidad: "reclamos",
    entidadId: id,
    detalle: {
      numero_seguimiento: reclamo.numero_seguimiento,
      eliminado_por: profile?.nombre ?? user.email,
    },
    ip,
    userAgent,
  });

  return NextResponse.json({ success: true });
}
