import { NextRequest, NextResponse } from "next/server";
import { createAuditLog } from "@/lib/security/audit";
import { consumeRateLimit } from "@/lib/security/rate-limit";
import { getClientIp, getUserAgent } from "@/lib/security/request";
import {
  ensureAssignableRole,
  getConfiguredSuperadminEmail,
  getServerAccessContext,
} from "@/lib/security/auth";
import { sanitizeEmail, sanitizeText } from "@/lib/security/sanitize";
import { SECURITY_RATE_LIMITS } from "@/lib/config/internal";
import { createServiceRoleClient } from "@/lib/supabase/server";
import type { UserRol } from "@/types/database";

export async function POST(request: NextRequest) {
  const { user, role } = await getServerAccessContext();
  const ip = getClientIp(request);
  const userAgent = getUserAgent(request);

  if (!user || (role !== "super_admin" && role !== "admin")) {
    await createAuditLog({
      userId: user?.id ?? null,
      accion: "admin_create_denied",
      entidad: "users",
      detalle: { reason: "forbidden" },
      ip,
      userAgent,
    });

    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const rateLimit = consumeRateLimit({
    key: `create-admin:${user.id}`,
    ...SECURITY_RATE_LIMITS.sensitiveWrites,
  });

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Demasiadas acciones sensibles. Intentá nuevamente en unos minutos." },
      { status: 429 }
    );
  }

  const body = await request.json();
  const nombre = sanitizeText(body.nombre, 120);
  const email = sanitizeEmail(body.email);
  const password = typeof body.password === "string" ? body.password.trim() : "";

  // Admins solo pueden crear admins; super_admin puede asignar cualquier rol
  const requestedRol = (typeof body.rol === "string" ? body.rol : "admin") as UserRol;
  const rol = role === "super_admin"
    ? ensureAssignableRole(email, requestedRol)
    : "admin";

  if (!nombre || !email || password.length < 8) {
    return NextResponse.json(
      { error: "Completá nombre, email válido y una contraseña de al menos 8 caracteres." },
      { status: 400 }
    );
  }

  if (email === getConfiguredSuperadminEmail()) {
    return NextResponse.json(
      { error: "Ese email está reservado para el superadmin principal." },
      { status: 400 }
    );
  }

  const service = createServiceRoleClient();

  // Intentar crear. Si ya existe en Auth, recuperarlo y sincronizar.
  let resolvedId: string;

  const { data: created, error: authError } = await service.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { nombre, rol },
  });

  if (authError) {
    const alreadyExists = authError.message.toLowerCase().includes("already");

    if (!alreadyExists) {
      await createAuditLog({
        userId: user.id,
        accion: "admin_create_failed",
        entidad: "users",
        detalle: { email, message: authError.message },
        ip,
        userAgent,
      });
      return NextResponse.json(
        { error: `No se pudo crear el usuario: ${authError.message}` },
        { status: 400 }
      );
    }

    // Ya existe en Auth — buscar su ID y sincronizar con la tabla users
    const { data: listData, error: listError } = await service.auth.admin.listUsers();
    const existing = listData?.users.find((u) => u.email === email);

    if (listError || !existing) {
      return NextResponse.json(
        { error: "El email ya está registrado y no se pudo recuperar el usuario." },
        { status: 409 }
      );
    }

    // Actualizar contraseña y metadata si viene nueva
    await service.auth.admin.updateUserById(existing.id, {
      password,
      user_metadata: { nombre, rol },
    });

    resolvedId = existing.id;
  } else {
    if (!created.user) {
      return NextResponse.json({ error: "No se pudo crear el usuario." }, { status: 400 });
    }
    resolvedId = created.user.id;
  }

  await service.from("users").upsert({
    id: resolvedId,
    nombre,
    email,
    rol,
    activo: true,
  }, { onConflict: "id" });

  await createAuditLog({
    userId: user.id,
    accion: "admin_created",
    entidad: "users",
    entidadId: resolvedId,
    detalle: { email, rol, creado_por_rol: role },
    ip,
    userAgent,
  });

  return NextResponse.json({ success: true, id: resolvedId });
}
