import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function ConfiguracionPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("users")
    .select("rol")
    .eq("id", user.id)
    .single();

  if (profile?.rol !== "super_admin") redirect("/admin/dashboard");

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#32105B]">Configuración</h1>
        <p className="mt-1 text-sm text-gray-400">Parámetros del sistema — solo super admin</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Categorías */}
        <div className="rounded-2xl bg-white shadow-sm border border-gray-100 p-6">
          <h2 className="text-sm font-bold text-[#32105B] mb-4">Categorías activas</h2>
          <div className="space-y-2">
            {["Calles", "Alumbrado", "Aguas", "Basura", "Inundación", "Inseguridad", "Otros"].map((cat) => (
              <div key={cat} className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
                <span className="text-sm font-medium text-gray-700">{cat}</span>
                <span className="text-[0.65rem] font-bold text-green-600">Activa</span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-gray-300">
            La edición de categorías estará disponible próximamente.
          </p>
        </div>

        {/* Numeración */}
        <div className="rounded-2xl bg-white shadow-sm border border-gray-100 p-6">
          <h2 className="text-sm font-bold text-[#32105B] mb-4">Numeración de reclamos</h2>
          <div className="rounded-xl bg-[#F8F5FF] px-4 py-4 border border-[#EDE4FA]">
            <p className="text-[0.65rem] font-bold uppercase tracking-widest text-[#6011E8] mb-1">
              Formato actual
            </p>
            <p className="font-mono text-lg font-extrabold text-[#32105B]">AVA-2026-000001</p>
            <p className="mt-1 text-xs text-gray-400">
              Prefijo: AVA — Año: automático — Secuencial: 6 dígitos
            </p>
          </div>
        </div>

        {/* Textos institucionales */}
        <div className="rounded-2xl bg-white shadow-sm border border-gray-100 p-6 lg:col-span-2">
          <h2 className="text-sm font-bold text-[#32105B] mb-4">Textos institucionales</h2>
          <div className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[0.65rem] font-bold uppercase tracking-widest text-gray-400">
                Nombre del bloque
              </label>
              <input
                type="text"
                defaultValue="Bloque La Libertad Avanza Avellaneda"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#6011E8]"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[0.65rem] font-bold uppercase tracking-widest text-gray-400">
                Referente
              </label>
              <input
                type="text"
                defaultValue="Cristian Frattini — Coordinador local y Presidente del bloque de concejales"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#6011E8]"
              />
            </div>
          </div>
          <p className="mt-4 text-xs text-gray-300">
            La persistencia de configuración estará disponible en la próxima versión.
          </p>
        </div>
      </div>
    </div>
  );
}
