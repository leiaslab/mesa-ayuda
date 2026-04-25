import Link from "next/link";
import { getServerAccessContext } from "@/lib/security/auth";
import { StatusBadge, PrioridadBadge } from "@/components/admin/StatusBadge";
import type { ReclamoCompleto, ReclamoEstado } from "@/types/database";
import ReclamosListClient from "./ReclamosListClient";

// Keep StatusBadge/PrioridadBadge imported to avoid unused-import warnings
void StatusBadge; void PrioridadBadge;

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
  const { supabase, role } = await getServerAccessContext();
  const isSuperAdmin = role === "super_admin";

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
        <ReclamosListClient reclamos={reclamos} isSuperAdmin={isSuperAdmin} />

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
