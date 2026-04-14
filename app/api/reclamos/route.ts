import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

// Cliente con service role para evitar restricciones de RLS en server-side
function getAdminClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      nombre, dni, telefono, email,
      direccion, entre_calles, barrio,
      categoria, subcategoria, descripcion,
      foto_base64, foto_mime,
    } = body;

    // Validación básica
    if (!nombre || !dni || !telefono || !direccion || !barrio || !categoria || !subcategoria || !descripcion) {
      return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 });
    }

    const supabase = getAdminClient();

    // 1. Insertar vecino
    const { data: vecino, error: vecinoError } = await supabase
      .from("vecinos")
      .insert({ nombre, dni, telefono, email: email || null, direccion, entre_calles: entre_calles || null, barrio })
      .select("id")
      .single();

    if (vecinoError || !vecino) {
      console.error("Error insertando vecino:", vecinoError);
      return NextResponse.json({ error: "Error al registrar los datos" }, { status: 500 });
    }

    // 2. Subir foto si existe
    let foto_url: string | null  = null;
    let foto_path: string | null = null;

    if (foto_base64 && foto_mime) {
      const buffer   = Buffer.from(foto_base64, "base64");
      const ext      = foto_mime.split("/")[1] ?? "jpg";
      const filename = `${vecino.id}/${Date.now()}.${ext}`;

      const { error: storageError } = await supabase.storage
        .from("reclamos-fotos")
        .upload(filename, buffer, { contentType: foto_mime, upsert: false });

      if (!storageError) {
        const { data: urlData } = supabase.storage
          .from("reclamos-fotos")
          .getPublicUrl(filename);
        foto_url  = urlData.publicUrl;
        foto_path = filename;
      }
    }

    // 3. Insertar reclamo
    const { data: reclamo, error: reclamoError } = await supabase
      .from("reclamos")
      .insert({
        vecino_id: vecino.id,
        categoria,
        subcategoria,
        descripcion,
        foto_url,
        foto_path,
      })
      .select("id, numero_seguimiento")
      .single();

    if (reclamoError || !reclamo) {
      console.error("Error insertando reclamo:", reclamoError);
      return NextResponse.json({ error: "Error al registrar el reclamo" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      id:                 reclamo.id,
      numero_seguimiento: reclamo.numero_seguimiento,
    });
  } catch (err) {
    console.error("Error en POST /api/reclamos:", err);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
