import { NextRequest, NextResponse } from "next/server";
import { getServerAccessContext } from "@/lib/security/auth";
import { createServiceRoleClient } from "@/lib/supabase/server";

const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const BUCKET = "reclamos-fotos";

export async function POST(request: NextRequest) {
  const { user, role } = await getServerAccessContext();

  if (!user || !role) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Formato de solicitud inválido" }, { status: 400 });
  }

  const file = formData.get("imagen") as File | null;

  if (!file || file.size === 0) {
    return NextResponse.json({ error: "No se recibió ninguna imagen" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Formato no soportado. Usá JPG, PNG o WebP" },
      { status: 400 }
    );
  }

  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json(
      { error: "La imagen no puede superar 5 MB" },
      { status: 400 }
    );
  }

  const service = createServiceRoleClient();
  const ext = file.type === "image/jpeg" ? "jpg" : file.type.split("/")[1];
  const filename = `splash/splash_${Date.now()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await service.storage
    .from(BUCKET)
    .upload(filename, buffer, { contentType: file.type, upsert: false });

  if (uploadError) {
    console.error("Splash upload error:", uploadError.message);
    return NextResponse.json({ error: "Error al subir la imagen" }, { status: 500 });
  }

  const { data: { publicUrl } } = service.storage.from(BUCKET).getPublicUrl(filename);

  const { error: dbError } = await service.from("site_content").upsert(
    {
      section_key: "splash.image_url",
      label: "Imagen del splash de entrada",
      value_text: publicUrl,
      value_json: null,
      editable: true,
      updated_by: user.id,
    },
    { onConflict: "section_key" }
  );

  if (dbError) {
    console.error("Splash DB error:", dbError.message);
    return NextResponse.json({ error: "Error al guardar la configuración" }, { status: 500 });
  }

  return NextResponse.json({ success: true, url: publicUrl });
}
