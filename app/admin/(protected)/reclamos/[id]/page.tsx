import { createClient } from "@/lib/supabase/server";
/* eslint-disable @next/next/no-img-element */
import { notFound } from "next/navigation";
import Link from "next/link";
import { StatusBadge, PrioridadBadge } from "@/components/admin/StatusBadge";
import ReclamoDetailClient from "./ReclamoDetailClient";
import type { ReclamoCompleto, HistorialEstado } from "@/types/database";
import { getReclamoDisplayData } from "@/lib/reclamo-details";

export default async function ReclamoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: reclamo }, { data: historial }, { data: documentos }, , { data: { user } }] =
    await Promise.all([
      supabase.from("reclamos_completos").select("*").eq("id", id).single(),
      supabase.from("historial_estados").select("*").eq("reclamo_id", id).order("created_at", { ascending: false }),
      supabase.from("documentos_generados").select("*").eq("reclamo_id", id).order("created_at", { ascending: false }),
      supabase.auth.getUser().then(async ({ data: { user } }) => {
        if (!user) return { data: null };
        return supabase.from("users").select("nombre, rol").eq("id", user.id).single();
      }),
      supabase.auth.getUser(),
    ]);

  if (!reclamo) notFound();

  const r = reclamo as ReclamoCompleto;
  const detalle = getReclamoDisplayData({
    descripcion: r.descripcion,
    direccionDenunciante: r.vecino_direccion,
  });

  return (
    <div className="space-y-6 p-6 lg:p-8">
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <Link href="/admin/reclamos" className="hover:text-[#9333EA]">Reclamos</Link>
        <span>/</span>
        <span className="font-mono font-bold text-[#4C1182]">{r.numero_seguimiento}</span>
      </div>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#4C1182]">{r.numero_seguimiento}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <StatusBadge estado={r.estado} />
            <PrioridadBadge prioridad={r.prioridad} />
            <span className="text-xs text-gray-400">{new Date(r.created_at).toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="border-b border-gray-50 px-6 py-4"><h2 className="text-sm font-bold text-[#4C1182]">Detalle del reclamo</h2></div>
            <div className="divide-y divide-gray-50">
              <Row label="Categoría" value={r.categoria} />
              <Row label="Subcategoría" value={r.subcategoria} />
              <Row label="Descripción" value={detalle.descripcion} multiline />
              <Row label="Denunciante" value={detalle.direccionDenunciante} />
              <Row label="Problema" value={detalle.direccionProblema} />
              {r.vecino_entre_calles && <Row label="Entre calles" value={r.vecino_entre_calles} />}
              <Row label="Barrio" value={r.vecino_barrio} />
            </div>
          </section>

          {r.foto_url && (
            <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
              <div className="border-b border-gray-50 px-6 py-4"><h2 className="text-sm font-bold text-[#4C1182]">Foto adjunta</h2></div>
              <div className="p-4">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={r.foto_url} alt="Foto del reclamo" className="w-full max-h-80 rounded-xl object-cover" /></div>
            </section>
          )}

          <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="border-b border-gray-50 px-6 py-4"><h2 className="text-sm font-bold text-[#4C1182]">Historial de estados</h2></div>
            <div className="p-4">
              {!historial || historial.length === 0 ? (
                <p className="py-4 text-center text-xs text-gray-400">Sin cambios de estado aún</p>
              ) : (
                <div className="space-y-3">
                  {(historial as HistorialEstado[]).map((item) => (
                    <div key={item.id} className="flex items-start gap-3">
                      <div className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-[#9333EA]" />
                      <div>
                        <p className="text-xs font-medium text-gray-700">{item.estado_anterior ? `${item.estado_anterior} → ${item.estado_nuevo}` : `Creado como ${item.estado_nuevo}`}</p>
                        {item.comentario && <p className="mt-0.5 text-xs text-gray-400">{item.comentario}</p>}
                        <p className="mt-0.5 text-[0.65rem] text-gray-300">{new Date(item.created_at).toLocaleString("es-AR")}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="border-b border-gray-50 px-6 py-4"><h2 className="text-sm font-bold text-[#4C1182]">Documentos generados</h2></div>
            <div className="p-4">
              {!documentos || documentos.length === 0 ? (
                <p className="py-4 text-center text-xs text-gray-400">No hay documentos generados</p>
              ) : (
                <div className="space-y-2">
                  {documentos.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                      <div>
                        <p className="text-xs font-semibold text-gray-700">{doc.nombre_archivo}</p>
                        <p className="text-[0.65rem] text-gray-400">{doc.tipo_documento.toUpperCase()} — {new Date(doc.created_at).toLocaleDateString("es-AR")}</p>
                      </div>
                      <a href={doc.archivo_url} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-[#9333EA] hover:underline">Descargar</a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="border-b border-gray-50 px-6 py-4"><h2 className="text-sm font-bold text-[#4C1182]">Datos del vecino</h2></div>
            <div className="divide-y divide-gray-50">
              <Row label="Nombre" value={r.vecino_nombre} />
              <Row label="DNI" value={r.vecino_dni} />
              <Row label="Teléfono" value={r.vecino_telefono} />
              {r.vecino_email && <Row label="Email" value={r.vecino_email} />}
            </div>
            <div className="flex flex-col gap-2 px-4 pb-4 pt-2">
              <a href={`https://wa.me/54${r.vecino_telefono.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 rounded-xl bg-[#25D366] py-2.5 text-xs font-bold text-white"><span>💬</span> WhatsApp</a>
            </div>
          </section>

          <ReclamoDetailClient reclamo={r} estadoActual={r.estado} prioridadActual={r.prioridad} observaciones={r.observaciones_internas ?? ""} userId={user?.id ?? ""} />
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, multiline }: { label: string; value: string; multiline?: boolean }) {
  return <div className="flex gap-4 px-6 py-3"><span className="w-24 flex-shrink-0 pt-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-gray-400">{label}</span><span className={`flex-1 text-sm text-gray-700 ${multiline ? "leading-relaxed" : ""}`}>{value}</span></div>;
}
