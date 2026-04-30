import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { appendReclamoToSheet } from "@/lib/google-sheets";
import { buildSheetsDescription, buildStoredReclamoDescription } from "@/lib/reclamo-details";
import { contieneInapropiado } from "@/lib/filtro-palabras";

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
      nombre,
      apellido,
      dni,
      fecha_nacimiento,
      sexo,
      telefono,
      email,
      direccion_denunciante,
      direccion_problema,
      entre_calles,
      barrio,
      categoria,
      subcategoria,
      descripcion,
      foto_base64,
      foto_mime,
    } = body;

    const camposTexto = [descripcion, barrio].filter(Boolean).join(" ");
    if (contieneInapropiado(camposTexto)) {
      return NextResponse.json(
        { error: "Tu reclamo contiene lenguaje inapropiado. Por favor revisá el texto y volvé a intentarlo." },
        { status: 400 }
      );
    }

    const today = new Date().toISOString().slice(0, 10);
    const hasFutureBirthDate =
      typeof fecha_nacimiento === "string" && fecha_nacimiento.trim() !== "" && fecha_nacimiento > today;

    if (
      !nombre ||
      !apellido ||
      !dni ||
      !fecha_nacimiento ||
      !telefono ||
      !direccion_denunciante ||
      !direccion_problema ||
      !barrio ||
      !categoria ||
      !subcategoria ||
      !descripcion ||
      hasFutureBirthDate
    ) {
      return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 });
    }

    const supabase = getAdminClient();

    const { data: vecino, error: vecinoError } = await supabase
      .from("vecinos")
      .insert({
        nombre,
        apellido,
        dni,
        fecha_nacimiento,
        sexo: sexo || null,
        telefono,
        email: email || null,
        direccion: direccion_denunciante,
        entre_calles: entre_calles || null,
        barrio,
      })
      .select("id")
      .single();

    if (vecinoError || !vecino) {
      console.error("Error insertando vecino:", vecinoError);
      return NextResponse.json({ error: "Error al registrar los datos" }, { status: 500 });
    }

    let foto_url: string | null = null;
    let foto_path: string | null = null;

    if (foto_base64 && foto_mime) {
      const buffer = Buffer.from(foto_base64, "base64");
      const ext = foto_mime.split("/")[1] ?? "jpg";
      const filename = `${vecino.id}/${Date.now()}.${ext}`;
      const { error: storageError } = await supabase.storage
        .from("reclamos-fotos")
        .upload(filename, buffer, { contentType: foto_mime, upsert: false });

      if (!storageError) {
        const { data: urlData } = supabase.storage.from("reclamos-fotos").getPublicUrl(filename);
        foto_url = urlData.publicUrl;
        foto_path = filename;
      }
    }

    const { data: reclamo, error: reclamoError } = await supabase
      .from("reclamos")
      .insert({
        vecino_id: vecino.id,
        categoria,
        subcategoria,
        descripcion: buildStoredReclamoDescription({
          direccionProblema: direccion_problema,
          descripcion,
        }),
        foto_url,
        foto_path,
      })
      .select("id, numero_seguimiento")
      .single();

    if (reclamoError || !reclamo) {
      console.error("Error insertando reclamo:", reclamoError);
      return NextResponse.json({ error: "Error al registrar el reclamo" }, { status: 500 });
    }

    const googleSheets = await appendReclamoToSheet({
      numero_seguimiento: reclamo.numero_seguimiento,
      fecha: new Date().toLocaleDateString("es-AR"),
      nombre,
      apellido,
      dni,
      telefono,
      email: email || null,
      direccion: direccion_problema,
      entre_calles: entre_calles || null,
      barrio,
      categoria,
      subcategoria,
      descripcion: buildSheetsDescription({
        descripcion,
        direccionDenunciante: direccion_denunciante,
      }),
    });

    return NextResponse.json({
      success: true,
      id: reclamo.id,
      numero_seguimiento: reclamo.numero_seguimiento,
      googleSheets,
    });
  } catch (err) {
    console.error("Error en POST /api/reclamos:", err);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
