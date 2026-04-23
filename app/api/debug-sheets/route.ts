import { NextResponse } from "next/server";
import { google } from "googleapis";
import { getGoogleAuth, getGoogleServiceAccountEmail } from "@/lib/google-auth";

export async function GET() {
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID?.trim();
  const configuredSheetName = process.env.GOOGLE_SHEETS_SHEET_NAME?.trim();
  const serviceAccountEmail = getGoogleServiceAccountEmail();

  const idDebug = spreadsheetId
    ? { length: spreadsheetId.length, value: spreadsheetId, trimmed: spreadsheetId }
    : null;

  if (!spreadsheetId) {
    return NextResponse.json({
      ok: false,
      error: "Falta GOOGLE_SHEETS_SPREADSHEET_ID",
      has: {
        serviceAccount: Boolean(serviceAccountEmail),
        spreadsheetId: Boolean(spreadsheetId),
      },
      serviceAccountEmail,
      configuredSheetName,
      idDebug,
    });
  }

  try {
    const auth = getGoogleAuth(["https://www.googleapis.com/auth/spreadsheets"]);
    if (!auth) {
      return NextResponse.json({
        ok: false,
        error: "No se pudo crear auth",
        serviceAccountEmail,
        configuredSheetName,
      });
    }

    const sheets = google.sheets({ version: "v4", auth });
    const meta = await sheets.spreadsheets.get({ spreadsheetId });
    const tabNames = meta.data.sheets?.map((s) => s.properties?.title).filter(Boolean) ?? [];

    const targetSheet =
      tabNames.find((tab) => tab === configuredSheetName) ??
      tabNames.find((tab) => tab?.trim() === configuredSheetName?.trim()) ??
      tabNames[0];

    if (!targetSheet) {
      return NextResponse.json({
        ok: false,
        error: "La planilla no tiene pestañas",
        tabs: tabNames,
        spreadsheetId,
        serviceAccountEmail,
      });
    }

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `'${targetSheet.replace(/'/g, "''")}'!A:A`,
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      requestBody: { values: [[`TEST OK - ${new Date().toLocaleString("es-AR")}`]] },
    });

    return NextResponse.json({
      ok: true,
      tabs: tabNames,
      targetSheet,
      spreadsheetId,
      serviceAccountEmail,
    });
  } catch (err: unknown) {
    const e = err as { message?: string; code?: number; errors?: unknown[] };
    return NextResponse.json({
      ok: false,
      message: e?.message,
      code: e?.code,
      errors: e?.errors,
      serviceAccountEmail,
      configuredSheetName,
      idDebug,
    });
  }
}
