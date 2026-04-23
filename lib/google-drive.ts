import { Readable } from "node:stream";
import { google } from "googleapis";
import { getGoogleAuth } from "./google-auth";

export function isGoogleDriveEnabled() {
  return Boolean(
    process.env.GOOGLE_SERVICE_ACCOUNT_JSON &&
      process.env.GOOGLE_DRIVE_FOLDER_ID
  );
}

export async function uploadBufferToGoogleDrive(input: {
  filename: string;
  mimeType: string;
  buffer: Buffer;
}) {
  const auth = getGoogleAuth(["https://www.googleapis.com/auth/drive.file"]);
  if (!auth) return null;

  const drive = google.drive({ version: "v3", auth });

  const response = await drive.files.create({
    requestBody: {
      name: input.filename,
      parents: [process.env.GOOGLE_DRIVE_FOLDER_ID!],
    },
    media: {
      mimeType: input.mimeType,
      body: Readable.from(input.buffer),
    },
    fields: "id, webViewLink, webContentLink",
  });

  return response.data;
}
