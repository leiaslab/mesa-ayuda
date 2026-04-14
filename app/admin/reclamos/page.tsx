import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { StatusBadge, PrioridadBadge } from "@/components/admin/StatusBadge";
import type { ReclamoCompleto, ReclamoEstado, ReclamoPrioridad } from "@/types/database";

const ESTADOS: { value: ReclamoEstado | ""; label: string }[] = [
  { value: "",           label: "Todos los estados" },
  { value: "pendiente",  label: "Pendiente" },
  { value: "en_proceso", label: "En proceso" },
  { value: "resuelto",   label: "Resuelto" },
  { value: "rechazado",  label: "Rechazado" },
  { value: "cerrado",    label: "Cerrado" },
];

const CATEGORIAS = ["", "Calles", "Alumbrado", "Aguas", "Basura", "Inundación", "Inseguridad", "Otros"];

type SearchParams = {
  q?:         string;
  estado?:    string;
  categoria?: string;
  barrio?:    string;
  page?:      string;
};

const PAGE_SIZE = 20;

export default async function ReclamosPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  const q         = params.q         ?? "";
  const estado    = params.estado    ?? "";
  const categoria = params.categoria ?? "";
  const page      = Math.max(1, parseInt(params.page ?? "1", 10));
  const from      = (page - 1) * PAGE_SIZE;

  let query = supabase
    .from("reclamos_completos")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, from + PAGE_SIZE - 1);

  if (estado)    query = query.eq("estado", estado as ReclamoEstado);
  if (categoria) query = query.eq("categoria", categoria);
  if (q) {
    query = query.or(
      `vecino_nombre.ilike.%${q}%,vecino_dni.ilike.%${q}%,vecino_telefono.ilike.%${q}%,numero_seguimiento.ilike.%${q}%`
    );
  }

  const { data, count } = await query;
  const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE);
  const reclamos = (data ?? []) as ReclamoCompleto[];

  const buildUrl = (overrides: SearchParams) => {
    const p = { q, estado, categoria, page: String(page), ...overrides };
    const qs = Object.entries(p)
      .filter(([, v]) => v)
      .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
      .join("&");
    return `/admin/reclamos${qs ? `?${qs}` : ""}`;
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#32105B]">Reclamos</h1>
          <p className="mt-1 text-sm text-gray-400">
            {count ?? 0} reclamo{(count ?? 0) !== 1 ? "s" : ""} encontrado{(count ?? 0) !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Filtros */}
      <form method="GET" className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <input
          name="q"
          defaultValue={q}
          placeholder="Buscar por nombre, DNI, teléfono o N°..."
          className="col-span-1 sm:col-span-2 lg:col-span-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#6011E8] focus:ring-2 focus:ring-[#6011E8]/10"
        />
        <select
          name="estado"
          defaultValue={estado}
          className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-[#6011E8]"
        >
          {ESTADOS.map((e) => (
            <option key={e.value} value={e.value}>{e.label}</option>
          ))}
        </select>
        <select
          name="categoria"
          defaultValue={categoria}
          className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-[#6011E8]"
        >
          {CATEGORIAS.map((c) => (
            <option key={c} value={c}>{c || "Todas las categorías"}</option>
          ))}
        </select>
        <div className="col-span-1 sm:col-span-2 lg:col-span-4 flex gap-2">
          <button
            type="submit"
            className="rounded-xl px-5 py-2.5 text-sm font-bold text-white"
            style={{ background: "linear-gradient(135deg, #32105B 0%, #6011E8 100%)" }}
          >
            Filtrar
          </button>
          <a
            href="/admin/reclamos"
            className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            Limpiar
          </a>
        </div>
      </form>

      {/* Tabla */}
      <div className="rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden">
        {reclamos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="text-5xl mb-4">🔍</span>
            <p className="text-sm font-semibold text-gray-400">No se encontraron reclamos</p>
            <p className="text-xs text-gray-300 mt-1">Probá con otros filtros</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  {["N° Seguimiento", "Vecino", "Categoría", "Barrio", "Prioridad", "Estado", "Fecha"].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-left text-[0.65rem] font-bold uppercase tracking-widest text-gray-400"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {reclamos.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <Link
                        href={`/admin/reclamos/${r.id}`}
                        className="font-mono text-xs font-bold text-[#6011E8] hover:underline whitespace-nowrap"
                      >
                        {r.numero_seguimiento}
                      </Link>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-gray-800 whitespace-nowrap">{r.vecino_nombre}</p>
                      <p className="text-xs text-gray-400">{r.vecino_dni}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-gray-800">{r.categoria}</p>
                      <p className="text-xs text-gray-400">{r.subcategoria}</p>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-gray-600 whitespace-nowrap">
                      {r.vecino_barrio}
                    </td>
                    <td className="px-5 py-3.5">
                      <PrioridadBadge prioridad={r.prioridad} />
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge estado={r.estado} />
                    </td>
                    <td className="px-5 py-3.5 text-xs text-gray-400 whitespace-nowrap">
                      {new Date(r.created_at).toLocaleDateString("es-AR", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-50 px-5 py-4">
            <p className="text-xs text-gray-400">
              Página {page} de {totalPages}
            </p>
            <div className="flex gap-2">
              {page > 1 && (
                <a
                  href={buildUrl({ page: String(page - 1) })}
                  className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
                >
                  ← Anterior
                </a>
              )}
              {page < totalPages && (
                <a
                  href={buildUrl({ page: String(page + 1) })}
                  className="rounded-lg px-3 py-1.5 text-xs font-bold text-white"
                  style={{ backgroundColor: "#32105B" }}
                >
                  Siguiente →
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
