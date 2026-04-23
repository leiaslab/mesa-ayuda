import { readFileSync } from "node:fs";
import { google } from "googleapis";

type GoogleServiceAccountCredentials = {
  client_email?: string;
  private_key?: string;
  [key: string]: unknown;
};

function normalizePrivateKey(input: unknown) {
  if (typeof input !== "string") return undefined;
  return input.replace(/\\n/g, "\n");
}

function normalizeCredentials(
  credentials: Record<string, unknown>
): GoogleServiceAccountCredentials {
  return {
    ...credentials,
    private_key: normalizePrivateKey(credentials.private_key),
  };
}

function parseServiceAccountJson(raw: string) {
  try {
    return normalizeCredentials(JSON.parse(raw) as Record<string, unknown>);
  } catch {
    console.error("Google service account JSON is not valid JSON");
    return null;
  }
}

function getServiceAccountCredentials() {
  const inlineJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON?.trim();
  if (inlineJson) return parseServiceAccountJson(inlineJson);

  const base64Json = process.env.GOOGLE_SERVICE_ACCOUNT_JSON_BASE64?.trim();
  if (base64Json) {
    try {
      return parseServiceAccountJson(Buffer.from(base64Json, "base64").toString("utf8"));
    } catch {
      console.error("GOOGLE_SERVICE_ACCOUNT_JSON_BASE64 is not valid base64");
      return null;
    }
  }

  const filePath = process.env.GOOGLE_SERVICE_ACCOUNT_FILE?.trim();
  if (filePath) {
    try {
      return parseServiceAccountJson(readFileSync(filePath, "utf8"));
    } catch (error) {
      const message = error instanceof Error ? error.message : "unknown error";
      console.error("Unable to read GOOGLE_SERVICE_ACCOUNT_FILE:", message);
      return null;
    }
  }

  return null;
}

export function getGoogleAuth(scopes: string[]) {
  const credentials = getServiceAccountCredentials();
  if (!credentials) return null;

  return new google.auth.GoogleAuth({ credentials, scopes });
}

export function getGoogleServiceAccountEmail() {
  const credentials = getServiceAccountCredentials();
  return typeof credentials?.client_email === "string" ? credentials.client_email : null;
}
