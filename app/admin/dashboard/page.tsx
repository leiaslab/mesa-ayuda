import { createClient } from "@/lib/supabase/server";
import { StatusBadge, PrioridadBadge } from "@/components/admin/StatusBadge";
import type { ReclamoCompleto } from "@/types/database";

export default async function DashboardPage() {
  const supabase = await createClient();

  // Obtener stats
  const [
    { count: total },
    { count: pendientes },
    { count: enProceso },
    { count: resueltos },
    { data: recientes },
  ] = await Promise.all([
    supabase.from("reclamos").select("*", { count: "exact", head: true }),
    supabase.from("reclamos").select("*", { count: "exact", head: true }).eq("estado", "pendiente"),
    supabase.from("reclamos").select("*", { count: "exact", head: true }).eq("estado", "en_proceso"),
    supabase.from("reclamos").select("*", { count: "exact", head: true }).eq("estado", "resuelto"),
    supabase
      .from("reclamos_completos")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(8),
  ]);

  const stats = [
    { label: "Total reclamos", value: total ?? 0, color: "#32105B", bg: "#F3EEFF" },
    { label: "Pendientes",     value: pendientes ?? 0, color: "#b45309", bg: "#FEF3C7" },
    { label: "En proceso",     value: enProceso ?? 0, color: "#1d4ed8", bg: "#DBEAFE" },
    { label: "Resueltos",      value: resueltos ?? 0, color: "#15803d", bg: "#DCFCE7" },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-[#32105B]">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-400">
          Resumen general de reclamos vecinales
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
            <p className="text-xs font-semibold text-gray-400 mb-2">{s.label}</p>
            <p
              className="text-3xl font-extrabold"
              style={{ color: s.color }}
            >
              {s.value}
            </p>
            <div
              className="mt-3 h-1 w-10 rounded-full"
              style={{ backgroundColor: s.color, opacity: 0.3 }}
            />
          </div>
        ))}
      </div>

      {/* Últimos reclamos */}
      <div className="rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
          <h2 className="text-base font-bold text-[#32105B]">Últimos reclamos</h2>
          <a
            href="/admin/reclamos"
            className="text-xs font-semibold text-[#6011E8] hover:underline"
          >
            Ver todos →
          </a>
        </div>

        {!recientes || recientes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <span className="text-4xl mb-3">📋</span>
            <p className="text-sm font-semibold text-gray-400">No hay reclamos aún</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-50">
                  <th className="px-6 py-3 text-left text-[0.65rem] font-bold uppercase tracking-widest text-gray-400">
                    N° Seguimiento
                  </th>
                  <th className="px-6 py-3 text-left text-[0.65rem] font-bold uppercase tracking-widest text-gray-400 hidden md:table-cell">
                    Vecino
                  </th>
                  <th className="px-6 py-3 text-left text-[0.65rem] font-bold uppercase tracking-widest text-gray-400">
                    Categoría
                  </th>
                  <th className="px-6 py-3 text-left text-[0.65rem] font-bold uppercase tracking-widest text-gray-400">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-[0.65rem] font-bold uppercase tracking-widest text-gray-400 hidden lg:table-cell">
                    Fecha
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {(recientes as ReclamoCompleto[]).map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-3.5">
                      <a
                        href={`/admin/reclamos/${r.id}`}
                        className="font-mono text-xs font-bold text-[#6011E8] hover:underline"
                      >
                        {r.numero_seguimiento}
                      </a>
                    </td>
                    <td className="px-6 py-3.5 hidden md:table-cell">
                      <p className="font-medium text-gray-800">{r.vecino_nombre}</p>
                      <p className="text-xs text-gray-400">{r.vecino_barrio}</p>
                    </td>
                    <td className="px-6 py-3.5">
                      <p className="font-medium text-gray-800">{r.categoria}</p>
                      <p className="text-xs text-gray-400">{r.subcategoria}</p>
                    </td>
                    <td className="px-6 py-3.5">
                      <StatusBadge estado={r.estado} />
                    </td>
                    <td className="px-6 py-3.5 hidden lg:table-cell text-xs text-gray-400">
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
      </div>
    </div>
  );
}
