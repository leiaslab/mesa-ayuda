import { NextRequest, NextResponse } from "next/server";
import { createAuditLog } from "@/lib/security/audit";
import { getClientIp, getUserAgent } from "@/lib/security/request";
import { getServerAccessContext } from "@/lib/security/auth";
import { createServiceRoleClient } from "@/lib/supabase/server";

export async function DELETE(request: NextRequest) {
  const { user, role, profile } = await getServerAccessContext();
  const ip = getClientIp(request);
  const userAgent = getUserAgent(request);

  if (!user || role !== "super_admin") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const service = createServiceRoleClient();

  // Contar primero para el audit log
  const { count } = await service
    .from("reclamos")
    .select("id", { count: "exact", head: true });

  // Eliminar todos los reclamos (historial_estados se elimina por CASCADE en la DB)
  const { error } = await service
    .from("reclamos")
    .delete()
    .not("id", "is", null);

  if (error) {
    return NextResponse.json({ error: "No se pudieron eliminar los reclamos." }, { status: 500 });
  }

  await createAuditLog({
    userId: user.id,
    accion: "reset_todos_reclamos",
    entidad: "reclamos",
    detalle: {
      eliminados: count ?? 0,
      eliminado_por: profile?.nombre ?? user.email,
    },
    ip,
    userAgent,
  });

  return NextResponse.json({ success: true, eliminados: count ?? 0 });
}
