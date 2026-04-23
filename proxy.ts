import { createServerClient } from "@supabase/ssr";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import {
  ADMIN_HOME_PATH,
  LEGACY_LOGIN_PATH,
  PRIVATE_LOGIN_PATH,
  PUBLIC_HOME_PATH,
} from "@/lib/config/internal";
import { getEffectiveRole } from "@/lib/security/auth";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

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
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  if (pathname === LEGACY_LOGIN_PATH) {
    const url = request.nextUrl.clone();
    url.pathname = PRIVATE_LOGIN_PATH;
    return NextResponse.redirect(url);
  }

  let role: "admin" | "super_admin" | null = null;

  if (user) {
    // Service role bypasses RLS — evita recursión infinita en políticas de la tabla users
    const db = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false } }
    );

    const { data: profile } = await db
      .from("users")
      .select("rol, activo")
      .eq("id", user.id)
      .maybeSingle();

    role =
      profile?.activo && user.email
        ? getEffectiveRole({
            authEmail: user.email,
            profileRole: profile.rol,
          })
        : null;
  }

  const isProtectedAdmin = pathname.startsWith("/admin") && pathname !== "/admin/login";
  const isProtectedSuperadmin = pathname.startsWith("/superadmin");
  const isPrivateLogin = pathname === PRIVATE_LOGIN_PATH;
  const isAdminLogin = pathname === "/admin/login";

  if (isAdminLogin && user && role) {
    const dest = role === "super_admin" ? "/superadmin" : ADMIN_HOME_PATH;
    const url = request.nextUrl.clone();
    url.pathname = dest;
    return NextResponse.redirect(url);
  }

  if ((isProtectedAdmin || isProtectedSuperadmin) && !user) {
    const url = request.nextUrl.clone();
    url.pathname = PRIVATE_LOGIN_PATH;
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  if ((isProtectedAdmin || isProtectedSuperadmin) && !role) {
    const url = request.nextUrl.clone();
    url.pathname = PUBLIC_HOME_PATH;
    return NextResponse.redirect(url);
  }

  if (isProtectedSuperadmin && role !== "super_admin") {
    const url = request.nextUrl.clone();
    url.pathname = ADMIN_HOME_PATH;
    return NextResponse.redirect(url);
  }

  if (isPrivateLogin && user && role) {
    const redirectTo = request.nextUrl.searchParams.get("redirect");
    const url = request.nextUrl.clone();
    url.pathname =
      redirectTo && redirectTo.startsWith("/")
        ? redirectTo
        : role === "super_admin"
        ? "/superadmin"
        : ADMIN_HOME_PATH;
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/superadmin/:path*", "/ingreso-privado", "/login"],
};