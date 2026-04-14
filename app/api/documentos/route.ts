import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { generarWord } from "@/lib/documents/word";
import { generarExcel } from "@/lib/documents/excel";
import type { Database, ReclamoCompleto } from "@/types/database";

function getAdminClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(request: NextRequest) {
  try {
    const { reclamo_id, tipo, usuario_id } = await request.json();

    if (!reclamo_id || !tipo) {
      return NextResponse.json({ error: "Faltan parámetros" }, { status: 400 });
    }

    const supabase = getAdminClient();

    // Obtener datos completos del reclamo
    const { data: reclamo, error } = await supabase
      .from("reclamos_completos")
      .select("*")
      .eq("id", reclamo_id)
      .single();

    if (error || !reclamo) {
      return NextResponse.json({ error: "Reclamo no encontrado" }, { status: 404 });
    }

    const r = reclamo as ReclamoCompleto;
    let buffer: Buffer;
    let contentType: string;
    let ext: string;

    if (tipo === "word") {
      buffer      = await generarWord(r);
      contentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      ext         = "docx";
    } else if (tipo === "excel") {
      buffer      = await generarExcel([r]);
      contentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      ext         = "xlsx";
    } else {
      return NextResponse.json({ error: "Tipo inválido" }, { status: 400 });
    }

    const filename = `${r.numero_seguimiento}_${Date.now()}.${ext}`;
    const storagePath = `reclamos/${reclamo_id}/${filename}`;

    // Subir a Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("documentos")
      .upload(storagePath, buffer, { contentType, upsert: false });

    if (uploadError) {
      console.error("Error subiendo documento:", uploadError);
      return NextResponse.json({ error: "Error al guardar el documento" }, { status: 500 });
    }

    const { data: urlData } = supabase.storage
      .from("documentos")
      .getPublicUrl(storagePath);

    // Registrar en tabla documentos_generados
    const { data: docRecord } = await supabase
      .from("documentos_generados")
      .insert({
        reclamo_id,
        tipo_documento: tipo as "word" | "excel",
        nombre_archivo: filename,
        archivo_url:    urlData.publicUrl,
        archivo_path:   storagePath,
        generado_por:   usuario_id ?? null,
      })
      .select()
      .single();

    return NextResponse.json({
      success:     true,
      url:         urlData.publicUrl,
      nombre:      filename,
      documento_id: docRecord?.id,
    });
  } catch (err) {
    console.error("Error en POST /api/documentos:", err);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
