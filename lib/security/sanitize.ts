export function sanitizeText(value: unknown, maxLength = 5000): string {
  if (typeof value !== "string") return "";

  return value
    .replace(/[<>]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

export function sanitizeMultilineText(value: unknown, maxLength = 5000): string {
  if (typeof value !== "string") return "";

  return value
    .replace(/[<>]/g, "")
    .replace(/\r/g, "")
    .trim()
    .slice(0, maxLength);
}

export function sanitizeEmail(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.trim().toLowerCase().slice(0, 320);
}

export function sanitizeDigits(value: unknown, maxLength = 32): string {
  if (typeof value !== "string") return "";
  return value.replace(/\D/g, "").slice(0, maxLength);
}

export function sanitizePhone(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.replace(/[^\d+\-()\s]/g, "").trim().slice(0, 32);
}

export function sanitizeNullableText(value: unknown, maxLength = 5000): string | null {
  const sanitized = sanitizeText(value, maxLength);
  return sanitized ? sanitized : null;
}
