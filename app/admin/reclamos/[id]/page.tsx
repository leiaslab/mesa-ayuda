import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { StatusBadge, PrioridadBadge } from "@/components/admin/StatusBadge";
import ReclamoDetailClient from "./ReclamoDetailClient";
import type { ReclamoCompleto, HistorialEstado } from "@/types/database";

export default async function ReclamoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [
    { data: reclamo },
    { data: historial },
    { data: documentos },
    { data: profile },
    { data: { user } },
  ] = await Promise.all([
    supabase
      .from("reclamos_completos")
      .select("*")
      .eq("id", id)
      .single(),
    supabase
      .from("historial_estados")
      .select("*")
      .eq("reclamo_id", id)
      .order("created_at", { ascending: false }),
    supabase
      .from("documentos_generados")
      .select("*")
      .eq("reclamo_id", id)
      .order("created_at", { ascending: false }),
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return { data: null };
      return supabase.from("users").select("nombre, rol").eq("id", user.id).single();
    }),
    supabase.auth.getUser(),
  ]);

  if (!reclamo) notFound();

  const r = reclamo as ReclamoCompleto;

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <Link href="/admin/reclamos" className="hover:text-[#6011E8]">
          Reclamos
        </Link>
        <span>/</span>
        <span className="font-mono font-bold text-[#32105B]">{r.numero_seguimiento}</span>
      </div>

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#32105B]">{r.numero_seguimiento}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <StatusBadge estado={r.estado} />
            <PrioridadBadge prioridad={r.prioridad} />
            <span className="text-xs text-gray-400">
              {new Date(r.created_at).toLocaleDateString("es-AR", {
                weekday: "long", day: "numeric", month: "long", year: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Columna principal */}
        <div className="lg:col-span-2 space-y-6">

          {/* Datos del reclamo */}
          <section className="rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-50">
              <h2 className="text-sm font-bold text-[#32105B]">Detalle del reclamo</h2>
            </div>
            <div className="divide-y divide-gray-50">
              <Row label="Categoría"    value={r.categoria} />
              <Row label="Subcategoría" value={r.subcategoria} />
              <Row label="Descripción"  value={r.descripcion} multiline />
              <Row label="Dirección"    value={r.vecino_direccion} />
              {r.vecino_entre_calles && (
                <Row label="Entre calles" value={r.vecino_entre_calles} />
              )}
              <Row label="Barrio"       value={r.vecino_barrio} />
            </div>
          </section>

          {/* Foto */}
          {r.foto_url && (
            <section className="rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-50">
                <h2 className="text-sm font-bold text-[#32105B]">Foto adjunta</h2>
              </div>
              <div className="p-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={r.foto_url}
                  alt="Foto del reclamo"
                  className="w-full max-h-80 object-cover rounded-xl"
                />
              </div>
            </section>
          )}

          {/* Historial */}
          <section className="rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-50">
              <h2 className="text-sm font-bold text-[#32105B]">Historial de estados</h2>
            </div>
            <div className="p-4">
              {!historial || historial.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-4">Sin cambios de estado aún</p>
              ) : (
                <div className="space-y-3">
                  {(historial as HistorialEstado[]).map((h) => (
                    <div key={h.id} className="flex items-start gap-3">
                      <div className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-[#6011E8]" />
                      <div>
                        <p className="text-xs font-medium text-gray-700">
                          {h.estado_anterior
                            ? `${h.estado_anterior} → ${h.estado_nuevo}`
                            : `Creado como ${h.estado_nuevo}`}
                        </p>
                        {h.comentario && (
                          <p className="text-xs text-gray-400 mt-0.5">{h.comentario}</p>
                        )}
                        <p className="text-[0.65rem] text-gray-300 mt-0.5">
                          {new Date(h.created_at).toLocaleString("es-AR")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Documentos generados */}
          <section className="rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-50">
              <h2 className="text-sm font-bold text-[#32105B]">Documentos generados</h2>
            </div>
            <div className="p-4">
              {!documentos || documentos.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-4">No hay documentos generados</p>
              ) : (
                <div className="space-y-2">
                  {documentos.map((d) => (
                    <div key={d.id} className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                      <div>
                        <p className="text-xs font-semibold text-gray-700">{d.nombre_archivo}</p>
                        <p className="text-[0.65rem] text-gray-400">
                          {d.tipo_documento.toUpperCase()} — {new Date(d.created_at).toLocaleDateString("es-AR")}
                        </p>
                      </div>
                      <a
                        href={d.archivo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-[#6011E8] hover:underline"
                      >
                        Descargar
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Columna lateral — acciones */}
        <div className="space-y-6">
          {/* Vecino */}
          <section className="rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-50">
              <h2 className="text-sm font-bold text-[#32105B]">Datos del vecino</h2>
            </div>
            <div className="divide-y divide-gray-50">
              <Row label="Nombre"    value={r.vecino_nombre} />
              <Row label="DNI"       value={r.vecino_dni} />
              <Row label="Teléfono"  value={r.vecino_telefono} />
              {r.vecino_email && <Row label="Email" value={r.vecino_email} />}
            </div>
            <div className="px-4 pb-4 pt-2 flex flex-col gap-2">
              <a
                href={`https://wa.me/54${r.vecino_telefono.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl bg-[#25D366] py-2.5 text-xs font-bold text-white"
              >
                <span>💬</span> WhatsApp
              </a>
            </div>
          </section>

          {/* Acciones — client component */}
          <ReclamoDetailClient
            reclamoId={r.id}
            estadoActual={r.estado}
            prioridadActual={r.prioridad}
            observaciones={r.observaciones_internas ?? ""}
            numeroSeguimiento={r.numero_seguimiento}
            userId={user?.id ?? ""}
          />
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  multiline,
}: {
  label: string;
  value: string;
  multiline?: boolean;
}) {
  return (
    <div className="flex gap-4 px-6 py-3">
      <span className="w-24 flex-shrink-0 text-[0.65rem] font-bold uppercase tracking-wider text-gray-400 pt-0.5">
        {label}
      </span>
      <span className={`flex-1 text-sm text-gray-700 ${multiline ? "leading-relaxed" : ""}`}>
        {value}
      </span>
    </div>
  );
}
