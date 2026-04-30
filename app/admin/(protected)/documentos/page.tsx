import { createServiceRoleClient } from "@/lib/supabase/server";
import Link from "next/link";
import type { DocumentoGenerado, DocumentoTipo } from "@/types/database";

const TIPO_ICONS: Record<DocumentoTipo, string> = {
  pdf:   "📄",
  word:  "📝",
  excel: "📊",
};

const TIPO_COLORS: Record<DocumentoTipo, string> = {
  pdf:   "bg-red-50 text-red-700",
  word:  "bg-blue-50 text-blue-700",
  excel: "bg-green-50 text-green-700",
};

export default async function DocumentosPage() {
  const service = createServiceRoleClient();

  const { data } = await service
    .from("documentos_generados")
    .select("*, reclamos(numero_seguimiento)")
    .order("created_at", { ascending: false })
    .limit(100);

  const documentos = ((data ?? []) as (DocumentoGenerado & { reclamos: { numero_seguimiento: string } | null })[]).map((doc) => ({
    ...doc,
    download_url: doc.archivo_url,
  }));

  type DocRow = DocumentoGenerado & {
    reclamos: { numero_seguimiento: string } | null;
    download_url: string;
  };

  return (
    <div className="space-y-5 p-4 md:p-6 lg:p-8">
      <div>
        <h1 className="text-xl font-extrabold text-[#4C1182] md:text-2xl">Documentos</h1>
        <p className="mt-1 text-sm text-gray-400">
          Documentos generados — {documentos.length} en total
        </p>
      </div>

      {documentos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center rounded-2xl bg-white border border-gray-100">
          <span className="text-5xl mb-4">📁</span>
          <p className="text-sm font-semibold text-gray-400">No hay documentos generados</p>
          <p className="text-xs text-gray-300 mt-1">
            Generalos desde el detalle de cada reclamo
          </p>
          <Link
            href="/admin/reclamos"
            className="mt-4 text-xs font-bold text-[#9333EA] hover:underline"
          >
            Ir a reclamos →
          </Link>
        </div>
      ) : (
        <div className="rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden">
          {/* Cards en mobile */}
          <div className="divide-y divide-gray-50 md:hidden">
            {(documentos as DocRow[]).map((doc) => (
              <div key={doc.id} className="flex items-start justify-between gap-3 px-4 py-3.5">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-gray-800">{doc.nombre_archivo}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[0.6rem] font-bold ${TIPO_COLORS[doc.tipo_documento]}`}>
                      {TIPO_ICONS[doc.tipo_documento]} {doc.tipo_documento.toUpperCase()}
                    </span>
                    {doc.reclamos && (
                      <Link
                        href={`/admin/reclamos/${doc.reclamo_id}`}
                        className="font-mono text-[0.65rem] font-bold text-[#9333EA]"
                      >
                        {doc.reclamos.numero_seguimiento}
                      </Link>
                    )}
                  </div>
                  <p className="mt-0.5 text-[0.65rem] text-gray-300">
                    {new Date(doc.created_at).toLocaleDateString("es-AR")}
                  </p>
                </div>
                <a
                  href={doc.download_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 text-xs font-bold text-[#9333EA]"
                >
                  Bajar
                </a>
              </div>
            ))}
          </div>

          {/* Tabla en desktop */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  {["Archivo", "Tipo", "Reclamo", "Fecha", ""].map((h, i) => (
                    <th
                      key={i}
                      className="px-5 py-3 text-left text-[0.65rem] font-bold uppercase tracking-widest text-gray-400"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {(documentos as DocRow[]).map((doc) => (
                  <tr key={doc.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-gray-800 text-xs">{doc.nombre_archivo}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[0.65rem] font-bold ${TIPO_COLORS[doc.tipo_documento]}`}
                      >
                        {TIPO_ICONS[doc.tipo_documento]}
                        {doc.tipo_documento.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      {doc.reclamos ? (
                        <Link
                          href={`/admin/reclamos/${doc.reclamo_id}`}
                          className="font-mono text-xs font-bold text-[#9333EA] hover:underline"
                        >
                          {doc.reclamos.numero_seguimiento}
                        </Link>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-xs text-gray-400 whitespace-nowrap">
                      {new Date(doc.created_at).toLocaleDateString("es-AR", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-5 py-3.5">
                      <a
                        href={doc.download_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-[#9333EA] hover:underline"
                      >
                        Descargar
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
