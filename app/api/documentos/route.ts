import { NextRequest, NextResponse } from "next/server";
import { generarExcel } from "@/lib/documents/excel";
import { generarWord } from "@/lib/documents/word";
import { generarPDFReclamo } from "@/lib/documents/pdf-server";
import { uploadBufferToGoogleDrive } from "@/lib/google-drive";
import { getServerAccessContext } from "@/lib/security/auth";
import { createAuditLog } from "@/lib/security/audit";
import { getClientIp, getUserAgent } from "@/lib/security/request";
import { sanitizeText } from "@/lib/security/sanitize";
import { createServiceRoleClient } from "@/lib/supabase/server";
import type { DocumentoTipo, ReclamoCompleto } from "@/types/database";

function getDocumentMeta(tipo: DocumentoTipo) {
  switch (tipo) {
    case "pdf":
      return { ext: "pdf", mimeType: "application/pdf" };
    case "word":
      return {
        ext: "docx",
        mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      };
    case "excel":
      return {
        ext: "xlsx",
        mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      };
  }
}

export async function POST(request: NextRequest) {
  const { user, role } = await getServerAccessContext();
  const ip = getClientIp(request);
  const userAgent = getUserAgent(request);

  if (!user || !role) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await request.json();
  const reclamoId = sanitizeText(body.reclamo_id, 100);
  const tipo = sanitizeText(body.tipo, 32) as DocumentoTipo;

  if (!reclamoId || !["pdf", "word", "excel"].includes(tipo)) {
    return NextResponse.json({ error: "Parámetros inválidos" }, { status: 400 });
  }

  const service = createServiceRoleClient();
  const { data: reclamo, error } = await service
    .from("reclamos_completos")
    .select("*")
    .eq("id", reclamoId)
    .single();

  if (error || !reclamo) {
    return NextResponse.json({ error: "Reclamo no encontrado" }, { status: 404 });
  }

  const full = reclamo as ReclamoCompleto;
  let buffer: Buffer;

  if (tipo === "pdf") {
    buffer = await generarPDFReclamo(full);
  } else if (tipo === "word") {
    buffer = await generarWord(full);
  } else {
    buffer = await generarExcel([full]);
  }

  const meta = getDocumentMeta(tipo);
  const filename = `${full.numero_seguimiento}_${Date.now()}.${meta.ext}`;
  const storagePath = `reclamos/${reclamoId}/${filename}`;

  const { error: uploadError } = await service.storage
    .from("documentos")
    .upload(storagePath, buffer, {
      contentType: meta.mimeType,
      upsert: false,
    });

  if (uploadError) {
    return NextResponse.json({ error: "No se pudo guardar el documento" }, { status: 500 });
  }

  const signed = await service.storage.from("documentos").createSignedUrl(storagePath, 60 * 60 * 24 * 7);

  let driveFile: { webViewLink?: string | null; id?: string | null } | null = null;
  try {
    driveFile = await uploadBufferToGoogleDrive({
      filename,
      mimeType: meta.mimeType,
      buffer,
    });
  } catch (driveErr) {
    console.error("Google Drive upload failed (non-fatal):", driveErr);
  }

  const publicReference = driveFile?.webViewLink ?? signed.data?.signedUrl ?? null;

  await service.from("documentos_generados").insert({
    reclamo_id: reclamoId,
    tipo_documento: tipo,
    nombre_archivo: filename,
    archivo_url: publicReference ?? storagePath,
    archivo_path: storagePath,
    generado_por: user.id,
  });

  await createAuditLog({
    userId: user.id,
    accion: "document_generated",
    entidad: "documentos_generados",
    entidadId: reclamoId,
    detalle: { tipo, filename, drive: Boolean(driveFile?.id) },
    ip,
    userAgent,
  });

  return NextResponse.json({
    success: true,
    filename,
    url: publicReference,
  });
}
