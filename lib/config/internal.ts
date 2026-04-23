export const PRIVATE_LOGIN_PATH = "/ingreso-privado";
export const LEGACY_LOGIN_PATH = "/login";
export const ADMIN_HOME_PATH = "/admin/dashboard";
export const SUPERADMIN_HOME_PATH = "/superadmin";
export const PUBLIC_HOME_PATH = "/";

export const SECURITY_RATE_LIMITS = {
  login: { windowMs: 15 * 60 * 1000, max: 5 },
  reclamos: { windowMs: 10 * 60 * 1000, max: 8 },
  exports: { windowMs: 10 * 60 * 1000, max: 10 },
  sensitiveWrites: { windowMs: 10 * 60 * 1000, max: 30 },
} as const;
