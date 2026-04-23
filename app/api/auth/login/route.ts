import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import { ADMIN_HOME_PATH, SECURITY_RATE_LIMITS } from "@/lib/config/internal";
import { createAuditLog } from "@/lib/security/audit";
import { getPostLoginRedirect, getEffectiveRole } from "@/lib/security/auth";
import { consumeRateLimit } from "@/lib/security/rate-limit";
import { getClientIp, getUserAgent } from "@/lib/security/request";
import { sanitizeEmail, sanitizeText } from "@/lib/security/sanitize";

function makeJsonResponse(
  body: Record<string, unknown>,
  responseWithCookies: NextResponse,
  init?: ResponseInit
) {
  const response = NextResponse.json(body, init);

  for (const cookie of responseWithCookies.cookies.getAll()) {
    response.cookies.set(cookie);
  }

  return response;
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const userAgent = getUserAgent(request);
  const body = await request.json();
  const email = sanitizeEmail(body.email);
  const password = typeof body.password === "string" ? body.password : "";
  const requestedRedirect = sanitizeText(body.redirectTo, 512);

  const rateLimit = consumeRateLimit({
    key: `login:${ip}:${email}`,
    ...SECURITY_RATE_LIMITS.login,
  });

  if (!rateLimit.allowed) {
    await createAuditLog({
      accion: "login_rate_limited",
      entidad: "auth",
      detalle: { email },
      ip,
      userAgent,
    });

    return NextResponse.json(
      { error: "Demasiados intentos. Esperá unos minutos e intentá nuevamente." },
      { status: 429 }
    );
  }

  let response = NextResponse.json({ success: false }, { status: 401 });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.json({ success: true });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    await createAuditLog({
      accion: "login_failed",
      entidad: "auth",
      detalle: { email },
      ip,
      userAgent,
    });

    return NextResponse.json(
      { error: "Credenciales inválidas o usuario sin acceso." },
      { status: 401 }
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "No pudimos validar la sesión." },
      { status: 401 }
    );
  }

  const adminClient = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} } }
  );

  const { data: profile } = await adminClient
    .from("users")
    .select("id, rol, activo")
    .eq("id", user.id)
    .maybeSingle();

  const role =
    profile?.activo && user.email
      ? getEffectiveRole({
          authEmail: user.email,
          profileRole: profile.rol,
        })
      : null;

  if (!profile?.activo || !role) {
    await supabase.auth.signOut();

    await createAuditLog({
      userId: user.id,
      accion: "login_blocked",
      entidad: "auth",
      detalle: { email, reason: "inactive_or_missing_role" },
      ip,
      userAgent,
    });

    return NextResponse.json(
      { error: "Tu usuario no tiene permisos para ingresar." },
      { status: 403 }
    );
  }

  await createAuditLog({
    userId: user.id,
    accion: "login_success",
    entidad: "auth",
    detalle: { email, role },
    ip,
    userAgent,
  });

  const redirectTo = getPostLoginRedirect(role, requestedRedirect || ADMIN_HOME_PATH);

  return makeJsonResponse(
    {
      success: true,
      redirectTo,
      role,
    },
    response
  );
}
