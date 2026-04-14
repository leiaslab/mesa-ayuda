import { createClient } from "@/lib/supabase/server";
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
  const supabase = await createClient();

  const { data } = await supabase
    .from("documentos_generados")
    .select("*, reclamos(numero_seguimiento)")
    .order("created_at", { ascending: false })
    .limit(100);

  const documentos = data ?? [];

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#32105B]">Documentos</h1>
        <p className="mt-1 text-sm text-gray-400">
          Documentos generados — {documentos.length} en total
        </p>
      </div>

      {documentos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center rounded-2xl bg-white border border-gray-100">
          <span className="text-5xl mb-4">📁</span>
          <p className="text-sm font-semibold text-gray-400">No hay documentos generados</p>
          <p className="text-xs text-gray-300 mt-1">
            Los documentos se generan desde el detalle de cada reclamo
          </p>
        </div>
      ) : (
        <div className="rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
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
                {documentos.map((doc: DocumentoGenerado & { reclamos: { numero_seguimiento: string } | null }) => (
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
                          className="font-mono text-xs font-bold text-[#6011E8] hover:underline"
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
                        href={doc.archivo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-[#6011E8] hover:underline"
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
