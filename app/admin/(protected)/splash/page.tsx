import { requireRole } from "@/lib/security/auth";
import { createServiceRoleClient } from "@/lib/supabase/server";
import SplashUploader from "@/components/admin/SplashUploader";

async function getCurrentSplashUrl(): Promise<string> {
  try {
    const service = createServiceRoleClient();
    const { data } = await service
      .from("site_content")
      .select("value_text")
      .eq("section_key", "splash.image_url")
      .maybeSingle();
    return data?.value_text?.trim() || "/splash.jpeg";
  } catch {
    return "/splash.jpeg";
  }
}

export default async function SplashAdminPage() {
  await requireRole("admin");
  const currentUrl = await getCurrentSplashUrl();

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8">
      <div>
        <h1 className="text-xl font-extrabold text-[#4C1182] md:text-2xl">Splash de entrada</h1>
        <p className="mt-1 text-sm text-gray-400">
          Imagen que aparece durante 1,5 segundos al abrir el sitio por primera vez
        </p>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <SplashUploader currentUrl={currentUrl} />
      </div>

      <div className="rounded-2xl border border-[#ebe1fb] bg-[#f7f2ff] p-5">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#9333EA]">
          ¿Cómo funciona?
        </p>
        <ul className="mt-3 space-y-2 text-sm text-[#6c5b87]">
          <li>· La imagen se muestra al abrir el sitio, centrada en pantalla, durante 1,5 segundos.</li>
          <li>· Al subir una nueva imagen, reemplaza la anterior automáticamente.</li>
          <li>· Formatos aceptados: JPG, PNG, WebP. Tamaño máximo: 5 MB.</li>
          <li>· La imagen ideal es vertical (relación 3:4 o similar) para verse bien en mobile y desktop.</li>
        </ul>
      </div>
    </div>
  );
}
