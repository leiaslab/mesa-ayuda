import { createClient } from "@supabase/supabase-js";
import type { Database, Json } from "@/types/database";

type AuditPayload = {
  userId?: string | null;
  accion: string;
  entidad: string;
  entidadId?: string | null;
  detalle?: Json | null;
  ip?: string | null;
  userAgent?: string | null;
};

function getServiceClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}

export async function createAuditLog(payload: AuditPayload) {
  try {
    const supabase = getServiceClient();

    await supabase.from("audit_logs").insert({
      user_id: payload.userId ?? null,
      accion: payload.accion,
      entidad: payload.entidad,
      entidad_id: payload.entidadId ?? null,
      detalle: payload.detalle ?? null,
      ip: payload.ip ?? null,
      user_agent: payload.userAgent ?? null,
    });
  } catch (error) {
    console.error("Audit log error", error);
  }
}
