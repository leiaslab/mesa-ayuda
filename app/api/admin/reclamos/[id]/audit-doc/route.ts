import { NextRequest, NextResponse } from "next/server";
import { createAuditLog } from "@/lib/security/audit";
import { getClientIp, getUserAgent } from "@/lib/security/request";
import { getServerAccessContext } from "@/lib/security/auth";
import { createServiceRoleClient } from "@/lib/supabase/server";

const TIPOS_VALIDOS = new Set(["pdf", "word", "excel"]);

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { user, role, profile } = await getServerAccessContext();

  if (!user || !role) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await request.json();
  const tipo = typeof body.tipo === "string" ? body.tipo : "";

  if (!TIPOS_VALIDOS.has(tipo)) {
    return NextResponse.json({ error: "Tipo inválido." }, { status: 400 });
  }

  const service = createServiceRoleClient();
  const { data: reclamo } = await service
    .from("reclamos")
    .select("numero_seguimiento")
    .eq("id", id)
    .single();

  await createAuditLog({
    userId: user.id,
    accion: "documento_generado",
    entidad: "reclamos",
    entidadId: id,
    detalle: {
      tipo,
      numero_seguimiento: reclamo?.numero_seguimiento ?? id,
      admin_nombre: profile?.nombre ?? user.email,
    },
    ip: getClientIp(request),
    userAgent: getUserAgent(request),
  });

  return NextResponse.json({ success: true });
}
