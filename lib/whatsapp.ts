const sanitizeWhatsAppNumber = (value?: string | null) =>
  (value ?? "").replace(/\D/g, "").trim();

export const DEFAULT_OFFICIAL_WHATSAPP_NUMBER =
  sanitizeWhatsAppNumber(process.env.NEXT_PUBLIC_OFFICIAL_WHATSAPP_NUMBER) ||
  "541128365690";

export const DEFAULT_OFFICIAL_WHATSAPP_URL = `https://wa.me/${DEFAULT_OFFICIAL_WHATSAPP_NUMBER}`;

export function buildWhatsAppUrl(whatsappUrl?: string | null, text?: string) {
  const rawValue = whatsappUrl?.trim() || DEFAULT_OFFICIAL_WHATSAPP_URL;

  try {
    const url = rawValue.startsWith("http")
      ? new URL(rawValue)
      : new URL(`https://wa.me/${sanitizeWhatsAppNumber(rawValue)}`);

    if (text) {
      url.searchParams.set("text", text);
    }

    return url.toString();
  } catch {
    const fallbackNumber =
      sanitizeWhatsAppNumber(rawValue) || DEFAULT_OFFICIAL_WHATSAPP_NUMBER;
    const baseUrl = `https://wa.me/${fallbackNumber}`;

    return text ? `${baseUrl}?text=${encodeURIComponent(text)}` : baseUrl;
  }
}
