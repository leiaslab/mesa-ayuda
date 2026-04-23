import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { StatusBadge } from "@/components/admin/StatusBadge";
import type { ReclamoCompleto } from "@/types/database";

export default async function DashboardPage() {
  const supabase = await createClient();

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
    { label: "Total reclamos", value: total ?? 0, color: "#4C1182" },
    { label: "Pendientes", value: pendientes ?? 0, color: "#b45309" },
    { label: "En proceso", value: enProceso ?? 0, color: "#1d4ed8" },
    { label: "Resueltos", value: resueltos ?? 0, color: "#15803d" },
  ];

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8">
      <div>
        <h1 className="text-xl font-extrabold text-[#4C1182] md:text-2xl">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-400">Resumen general de reclamos vecinales</p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm md:p-5">
            <p className="mb-1.5 text-xs font-semibold text-gray-400">{s.label}</p>
            <p className="text-2xl font-extrabold md:text-3xl" style={{ color: s.color }}>
              {s.value}
            </p>
            <div
              className="mt-2 h-1 w-8 rounded-full md:mt-3 md:w-10"
              style={{ backgroundColor: s.color, opacity: 0.3 }}
            />
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-50 px-4 py-3.5 md:px-6 md:py-4">
          <h2 className="text-sm font-bold text-[#4C1182] md:text-base">Últimos reclamos</h2>
          <Link href="/admin/reclamos" className="text-xs font-semibold text-[#9333EA] hover:underline">
            Ver todos →
          </Link>
        </div>

        {!recientes || recientes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <span className="mb-3 text-4xl">📋</span>
            <p className="text-sm font-semibold text-gray-400">No hay reclamos aún</p>
          </div>
        ) : (
          <>
            {/* Cards en mobile */}
            <div className="divide-y divide-gray-50 md:hidden">
              {(recientes as ReclamoCompleto[]).map((r) => (
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
                  </div>
                  <div className="flex-shrink-0 pt-0.5">
                    <StatusBadge estado={r.estado} />
                  </div>
                </Link>
              ))}
            </div>

            {/* Tabla en desktop */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-50">
                    <th className="px-6 py-3 text-left text-[0.65rem] font-bold uppercase tracking-widest text-gray-400">
                      N° seguimiento
                    </th>
                    <th className="px-6 py-3 text-left text-[0.65rem] font-bold uppercase tracking-widest text-gray-400">
                      Vecino
                    </th>
                    <th className="px-6 py-3 text-left text-[0.65rem] font-bold uppercase tracking-widest text-gray-400">
                      Categoría
                    </th>
                    <th className="px-6 py-3 text-left text-[0.65rem] font-bold uppercase tracking-widest text-gray-400">
                      Estado
                    </th>
                    <th className="hidden px-6 py-3 text-left text-[0.65rem] font-bold uppercase tracking-widest text-gray-400 lg:table-cell">
                      Fecha
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {(recientes as ReclamoCompleto[]).map((r) => (
                    <tr key={r.id} className="transition-colors hover:bg-gray-50/50">
                      <td className="px-6 py-3.5">
                        <Link
                          href={`/admin/reclamos/${r.id}`}
                          className="font-mono text-xs font-bold text-[#9333EA] hover:underline"
                        >
                          {r.numero_seguimiento}
                        </Link>
                      </td>
                      <td className="px-6 py-3.5">
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
                      <td className="hidden px-6 py-3.5 text-xs text-gray-400 lg:table-cell">
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
      </div>
    </div>
  );
}
