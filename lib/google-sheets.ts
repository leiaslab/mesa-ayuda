import { google } from "googleapis";
import { getGoogleAuth } from "./google-auth";

const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID?.trim();
const SHEET_NAME = process.env.GOOGLE_SHEETS_SHEET_NAME?.trim();

export interface ReclamoRow {
  numero_seguimiento: string;
  fecha: string;
  nombre: string;
  apellido: string | null;
  dni: string;
  telefono: string;
  email: string | null;
  direccion: string;
  entre_calles: string | null;
  barrio: string;
  categoria: string;
  subcategoria: string;
  descripcion: string;
}

export type GoogleSheetsAppendResult =
  | { ok: true; spreadsheetId: string; sheetName: string }
  | {
      ok: false;
      reason: string;
      message: string;
      spreadsheetId?: string | null;
      sheetName?: string | null;
    };

function normalizeSheetName(value: string) {
  return value.trim().replace(/^'+|'+$/g, "");
}

async function resolveSheetName(
  sheets: ReturnType<typeof google.sheets>,
  spreadsheetId: string
) {
  const meta = await sheets.spreadsheets.get({ spreadsheetId });
  const tabNames = (meta.data.sheets ?? [])
    .map((sheet) => sheet.properties?.title)
    .filter((value): value is string => Boolean(value));

  if (tabNames.length === 0) {
    throw new Error("La planilla no tiene pestañas disponibles.");
  }

  if (!SHEET_NAME) return tabNames[0];

  const exactMatch = tabNames.find((tabName) => tabName === SHEET_NAME);
  if (exactMatch) return exactMatch;

  const expected = normalizeSheetName(SHEET_NAME);
  const normalizedMatch = tabNames.find(
    (tabName) => normalizeSheetName(tabName) === expected
  );
  if (normalizedMatch) return normalizedMatch;

  throw new Error(
    `No encontré la pestaña "${SHEET_NAME}". Pestañas disponibles: ${tabNames.join(", ")}`
  );
}

export function isGoogleSheetsEnabled() {
  return Boolean(
    SPREADSHEET_ID &&
      (process.env.GOOGLE_SERVICE_ACCOUNT_JSON?.trim() ||
        process.env.GOOGLE_SERVICE_ACCOUNT_JSON_BASE64?.trim() ||
        process.env.GOOGLE_SERVICE_ACCOUNT_FILE?.trim())
  );
}

export async function appendReclamoToSheet(
  row: ReclamoRow
): Promise<GoogleSheetsAppendResult> {
  if (!SPREADSHEET_ID) {
    return {
      ok: false,
      reason: "missing_spreadsheet_id",
      message: "Falta GOOGLE_SHEETS_SPREADSHEET_ID.",
      spreadsheetId: null,
      sheetName: SHEET_NAME ?? null,
    };
  }

  const auth = getGoogleAuth(["https://www.googleapis.com/auth/spreadsheets"]);
  if (!auth) {
    return {
      ok: false,
      reason: "missing_auth",
      message:
        "No pude crear la autenticación de Google. Configurá GOOGLE_SERVICE_ACCOUNT_JSON o GOOGLE_SERVICE_ACCOUNT_FILE.",
      spreadsheetId: SPREADSHEET_ID,
      sheetName: SHEET_NAME ?? null,
    };
  }

  const sheets = google.sheets({ version: "v4", auth });

  const values = [
    row.fecha,
    row.numero_seguimiento,
    row.categoria,
    row.subcategoria,
    row.nombre,
    row.apellido ?? "",
    row.dni,
    row.telefono,
    row.email ?? "",
    row.direccion,
    row.entre_calles ?? "",
    row.barrio,
    row.descripcion,
  ];

  try {
    const resolvedSheetName = await resolveSheetName(sheets, SPREADSHEET_ID);

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `'${resolvedSheetName.replace(/'/g, "''")}'!A:M`,
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      requestBody: { values: [values] },
    });

    return {
      ok: true,
      spreadsheetId: SPREADSHEET_ID,
      sheetName: resolvedSheetName,
    };
  } catch (err: unknown) {
    const e = err as { message?: string; code?: number };
    console.error("Google Sheets append failed:", e?.code, e?.message);
    return {
      ok: false,
      reason: "append_failed",
      message: e?.message ?? "Falló el guardado en Google Sheets.",
      spreadsheetId: SPREADSHEET_ID,
      sheetName: SHEET_NAME ?? null,
    };
  }
}
