import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { StatusBadge, PrioridadBadge } from "@/components/admin/StatusBadge";
import type { ReclamoCompleto, ReclamoEstado } from "@/types/database";

const ESTADOS: { value: ReclamoEstado | ""; label: string }[] = [
  { value: "", label: "Todos los estados" },
  { value: "pendiente", label: "Pendiente" },
  { value: "en_proceso", label: "En proceso" },
  { value: "resuelto", label: "Resuelto" },
  { value: "rechazado", label: "Rechazado" },
  { value: "cerrado", label: "Cerrado" },
];

const CATEGORIAS = [
  "",
  "Calles",
  "Alumbrado",
  "Aguas",
  "Basura",
  "Inundación",
  "Inseguridad",
  "Otros",
];

type SearchParams = {
  q?: string;
  estado?: string;
  categoria?: string;
  barrio?: string;
  page?: string;
};

const PAGE_SIZE = 20;

export default async function ReclamosPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  const q = params.q ?? "";
  const estado = params.estado ?? "";
  const categoria = params.categoria ?? "";
  const page = Math.max(1, parseInt(params.page ?? "1", 10));
  const from = (page - 1) * PAGE_SIZE;

  let query = supabase
    .from("reclamos_completos")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, from + PAGE_SIZE - 1);

  if (estado) query = query.eq("estado", estado as ReclamoEstado);
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
    const nextParams = { q, estado, categoria, page: String(page), ...overrides };
    const qs = Object.entries(nextParams)
      .filter(([, value]) => value)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join("&");

    return `/admin/reclamos${qs ? `?${qs}` : ""}`;
  };

  return (
    <div className="space-y-5 p-4 md:p-6 lg:p-8">
      <div>
        <h1 className="text-xl font-extrabold text-[#4C1182] md:text-2xl">Reclamos</h1>
        <p className="mt-1 text-sm text-gray-400">
          {count ?? 0} reclamo{(count ?? 0) !== 1 ? "s" : ""} encontrado
          {(count ?? 0) !== 1 ? "s" : ""}
        </p>
      </div>

      <form method="GET" className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
        <input
          name="q"
          defaultValue={q}
          placeholder="Buscar por nombre, DNI, teléfono o N°..."
          className="col-span-1 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#9333EA] focus:ring-2 focus:ring-[#9333EA]/10 sm:col-span-2 lg:col-span-2"
        />
        <select
          name="estado"
          defaultValue={estado}
          className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-[#9333EA]"
        >
          {ESTADOS.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
        <select
          name="categoria"
          defaultValue={categoria}
          className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-[#9333EA]"
        >
          {CATEGORIAS.map((item) => (
            <option key={item} value={item}>
              {item || "Todas las categorías"}
            </option>
          ))}
        </select>
        <div className="col-span-1 flex gap-2 sm:col-span-2 lg:col-span-4">
          <button
            type="submit"
            className="rounded-xl px-5 py-2.5 text-sm font-bold text-white"
            style={{ background: "linear-gradient(135deg, #4C1182 0%, #9333EA 100%)" }}
          >
            Filtrar
          </button>
          <Link
            href="/admin/reclamos"
            className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            Limpiar
          </Link>
        </div>
      </form>

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        {reclamos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <span className="mb-4 text-5xl">🔍</span>
            <p className="text-sm font-semibold text-gray-400">No se encontraron reclamos</p>
            <p className="mt-1 text-xs text-gray-300">Probá con otros filtros</p>
          </div>
        ) : (
          <>
            {/* Cards en mobile */}
            <div className="divide-y divide-gray-50 md:hidden">
              {reclamos.map((r) => (
                <Link
                  key={r.id}
                  href={`/admin/reclamos/${r.id}`}
                  className="flex items-start justify-between gap-3 px-4 py-3.5 hover:bg-gray-50/60 active:bg-gray-100/60"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-xs font-bold text-[#9333EA]">
                      {r.numero_seguimiento}
                    </p>
                    <p className="mt-0.5 truncate text-sm font-medium text-gray-800">
                      {r.vecino_nombre}
                    </p>
                    <p className="text-xs text-gray-400">
                      {r.categoria} · {r.vecino_barrio}
                    </p>
                    <div className="mt-1.5 flex items-center gap-2">
                      <StatusBadge estado={r.estado} />
                      <PrioridadBadge prioridad={r.prioridad} />
                    </div>
                  </div>
                  <p className="flex-shrink-0 text-[0.65rem] text-gray-300">
                    {new Date(r.created_at).toLocaleDateString("es-AR", {
                      day: "2-digit",
                      month: "short",
                    })}
                  </p>
                </Link>
              ))}
            </div>

            {/* Tabla en desktop */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    {["N° seguimiento", "Vecino", "Categoría", "Barrio", "Prioridad", "Estado", "Fecha"].map(
                      (heading) => (
                        <th
                          key={heading}
                          className="px-5 py-3 text-left text-[0.65rem] font-bold uppercase tracking-widest text-gray-400"
                        >
                          {heading}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {reclamos.map((r) => (
                    <tr key={r.id} className="transition-colors hover:bg-gray-50/50">
                      <td className="px-5 py-3.5">
                        <Link
                          href={`/admin/reclamos/${r.id}`}
                          className="whitespace-nowrap font-mono text-xs font-bold text-[#9333EA] hover:underline"
                        >
                          {r.numero_seguimiento}
                        </Link>
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="whitespace-nowrap font-medium text-gray-800">{r.vecino_nombre}</p>
                        <p className="text-xs text-gray-400">{r.vecino_dni}</p>
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="font-medium text-gray-800">{r.categoria}</p>
                        <p className="text-xs text-gray-400">{r.subcategoria}</p>
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5 text-xs text-gray-600">
                        {r.vecino_barrio}
                      </td>
                      <td className="px-5 py-3.5">
                        <PrioridadBadge prioridad={r.prioridad} />
                      </td>
                      <td className="px-5 py-3.5">
                        <StatusBadge estado={r.estado} />
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5 text-xs text-gray-400">
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
          </>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-50 px-4 py-3.5 md:px-5 md:py-4">
            <p className="text-xs text-gray-400">
              Página {page} de {totalPages}
            </p>
            <div className="flex gap-2">
              {page > 1 && (
                <Link
                  href={buildUrl({ page: String(page - 1) })}
                  className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
                >
                  ← Anterior
                </Link>
              )}
              {page < totalPages && (
                <Link
                  href={buildUrl({ page: String(page + 1) })}
                  className="rounded-lg px-3 py-1.5 text-xs font-bold text-white"
                  style={{ backgroundColor: "#4C1182" }}
                >
                  Siguiente →
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
