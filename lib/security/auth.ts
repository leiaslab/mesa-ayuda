import { redirect } from "next/navigation";
import type { UserRol } from "@/types/database";
import { createClient } from "@/lib/supabase/server";
import {
  ADMIN_HOME_PATH,
  PRIVATE_LOGIN_PATH,
  PUBLIC_HOME_PATH,
  SUPERADMIN_HOME_PATH,
} from "@/lib/config/internal";

type ProfileSnapshot = {
  id: string;
  nombre: string;
  email: string;
  rol: UserRol;
  activo: boolean;
};

export function normalizeEmail(email?: string | null) {
  return (email || "").trim().toLowerCase();
}

export function getConfiguredSuperadminEmail() {
  return normalizeEmail(process.env.SUPERADMIN_EMAIL);
}

export function isConfiguredSuperadminEmail(email?: string | null) {
  const configured = getConfiguredSuperadminEmail();
  return Boolean(configured) && normalizeEmail(email) === configured;
}

export function getEffectiveRole(input: {
  authEmail?: string | null;
  profileRole?: UserRol | null;
}): UserRol | null {
  if (isConfiguredSuperadminEmail(input.authEmail)) {
    return "super_admin";
  }

  if (!input.profileRole) {
    return null;
  }

  return input.profileRole;
}

export function ensureAssignableRole(email: string, requestedRole: UserRol) {
  if (requestedRole === "super_admin" && !isConfiguredSuperadminEmail(email)) {
    return "admin" as const;
  }

  return requestedRole;
}

export async function getServerAccessContext() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { supabase, user: null, profile: null, role: null as UserRol | null };
  }

  const { data: profile } = await supabase
    .from("users")
    .select("id, nombre, email, rol, activo")
    .eq("id", user.id)
    .maybeSingle();

  const effectiveRole = profile?.activo
    ? getEffectiveRole({
        authEmail: user.email,
        profileRole: profile.rol,
      })
    : null;

  return {
    supabase,
    user,
    profile: (profile as ProfileSnapshot | null) ?? null,
    role: effectiveRole,
  };
}

export async function requireRole(required: "admin" | "super_admin") {
  const context = await getServerAccessContext();

  if (!context.user) {
    redirect(PRIVATE_LOGIN_PATH);
  }

  if (!context.profile?.activo || !context.role) {
    redirect(PUBLIC_HOME_PATH);
  }

  if (required === "super_admin" && context.role !== "super_admin") {
    redirect(ADMIN_HOME_PATH);
  }

  return context;
}

export function getPostLoginRedirect(role: UserRol | null, requested?: string | null) {
  if (requested && requested.startsWith("/")) {
    if (requested.startsWith("/superadmin") && role === "super_admin") {
      return requested;
    }

    if (requested.startsWith("/admin") && role) {
      return requested;
    }
  }

  if (role === "super_admin") {
    return SUPERADMIN_HOME_PATH;
  }

  return ADMIN_HOME_PATH;
}
