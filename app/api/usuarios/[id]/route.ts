import { NextRequest, NextResponse } from "next/server";
import { createAuditLog } from "@/lib/security/audit";
import { getClientIp, getUserAgent } from "@/lib/security/request";
import { getServerAccessContext } from "@/lib/security/auth";
import { createServiceRoleClient } from "@/lib/supabase/server";
import type { UserRol } from "@/types/database";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const ip = getClientIp(request);
  const userAgent = getUserAgent(request);

  const { user, role } = await getServerAccessContext();

  if (!user || role !== "super_admin") {
    await createAuditLog({
      userId: user?.id ?? null,
      accion: "admin_update_denied",
      entidad: "users",
      entidadId: id,
      detalle: { reason: "forbidden" },
      ip,
      userAgent,
    });
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  // No se puede modificar al propio superadmin
  if (id === user.id) {
    return NextResponse.json({ error: "No podés modificar tu propio usuario." }, { status: 400 });
  }

  const body = await request.json();

  const hasActivo = typeof body.activo === "boolean";
  const hasRol = typeof body.rol === "string";

  if (!hasActivo && !hasRol) {
    return NextResponse.json({ error: "Se requiere 'activo' o 'rol'." }, { status: 400 });
  }

  const service = createServiceRoleClient();

  const { data: targetUser } = await service
    .from("users")
    .select("id, rol, email")
    .eq("id", id)
    .single();

  if (!targetUser) {
    return NextResponse.json({ error: "Usuario no encontrado." }, { status: 404 });
  }

  if (targetUser.rol === "super_admin" && targetUser.email !== user.email) {
    return NextResponse.json({ error: "No se puede modificar al superadmin." }, { status: 400 });
  }

  const { error: updateError } = await service
    .from("users")
    .update({
      ...(hasActivo && { activo: body.activo as boolean }),
      ...(hasRol && { rol: body.rol as UserRol }),
    })
    .eq("id", id);

  if (updateError) {
    return NextResponse.json({ error: "No se pudo actualizar el usuario." }, { status: 500 });
  }

  await createAuditLog({
    userId: user.id,
    accion: hasActivo
      ? (body.activo ? "admin_activated" : "admin_deactivated")
      : "admin_rol_changed",
    entidad: "users",
    entidadId: id,
    detalle: {
      email: targetUser.email,
      ...(hasActivo && { activo: body.activo }),
      ...(hasRol && { rol: body.rol }),
    },
    ip,
    userAgent,
  });

  return NextResponse.json({ success: true });
}
