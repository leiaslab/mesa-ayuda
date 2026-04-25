import Link from "next/link";
import { requireRole } from "@/lib/security/auth";

const PAGE_SIZE = 20;

type SearchParams = {
  accion?: string;
  page?: string;
};

export default async function AuditoriaPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { supabase } = await requireRole("super_admin");
  const params = await searchParams;

  const accion = params.accion ?? "";
  const page   = Math.max(1, parseInt(params.page ?? "1", 10));
  const from   = (page - 1) * PAGE_SIZE;

  let query = supabase
    .from("audit_logs")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, from + PAGE_SIZE - 1);

  if (accion) query = query.ilike("accion", `%${accion}%`);

  const { data: logs, count } = await query;
  const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE);

  // Resolver nombres de usuarios
  const userIds = [...new Set((logs ?? []).map((l) => l.user_id).filter(Boolean))] as string[];
  let userMap = new Map<string, { nombre: string; email: string }>();

  if (userIds.length > 0) {
    const { data: users } = await supabase
      .from("users")
      .select("id, nombre, email")
      .in("id", userIds);

    userMap = new Map((users ?? []).map((u) => [u.id, { nombre: u.nombre, email: u.email }]));
  }

  const buildUrl = (overrides: SearchParams) => {
    const next = { accion, page: String(page), ...overrides };
    const qs = Object.entries(next)
      .filter(([, v]) => v)
      .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
      .join("&");
    return `/superadmin/auditoria${qs ? `?${qs}` : ""}`;
  };

  return (
    <div className="space-y-5 p-4 md:p-6 lg:p-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link
            href="/superadmin"
            className="mb-2 inline-flex items-center gap-1.5 text-xs font-semibold text-[#9333EA] hover:underline"
          >
            ← Superadmin
          </Link>
          <h1 className="text-xl font-extrabold text-[#4C1182] md:text-2xl">Auditoría</h1>
          <p className="mt-1 text-sm text-gray-400">
            {count ?? 0} registro{(count ?? 0) !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Filtro */}
      <form method="GET" className="flex gap-2">
        <input
          name="accion"
          defaultValue={accion}
          placeholder="Buscar por acción..."
          className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#9333EA] focus:ring-2 focus:ring-[#9333EA]/10 w-64"
        />
        <button
          type="submit"
          className="rounded-xl px-5 py-2.5 text-sm font-bold text-white"
          style={{ background: "linear-gradient(135deg, #4C1182 0%, #9333EA 100%)" }}
        >
          Filtrar
        </button>
        {accion && (
          <Link
            href="/superadmin/auditoria"
            className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            Limpiar
          </Link>
        )}
      </form>

      {/* Tabla */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        {(logs ?? []).length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-sm font-semibold text-gray-400">No hay registros de auditoría</p>
          </div>
        ) : (
          <>
            {/* Desktop */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    {["Fecha", "Acción", "Entidad", "Usuario", "Detalle"].map((h) => (
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
                  {(logs ?? []).map((log) => {
                    const actor = log.user_id ? userMap.get(log.user_id) : null;
                    return (
                      <tr key={log.id} className="hover:bg-gray-50/50">
                        <td className="whitespace-nowrap px-5 py-3 text-xs text-gray-400">
                          {new Date(log.created_at).toLocaleString("es-AR", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                        <td className="px-5 py-3">
                          <span className="inline-flex rounded-full bg-[#9333EA]/10 px-2.5 py-1 text-[0.65rem] font-bold text-[#7C3AED]">
                            {log.accion}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-xs text-gray-600">
                          <p>{log.entidad}</p>
                          {log.entidad_id && (
                            <p className="font-mono text-[0.6rem] text-gray-300 truncate max-w-[100px]">
                              {log.entidad_id}
                            </p>
                          )}
                        </td>
                        <td className="px-5 py-3 text-xs">
                          {actor ? (
                            <>
                              <p className="font-medium text-gray-800">{actor.nombre}</p>
                              <p className="text-gray-400">{actor.email}</p>
                            </>
                          ) : (
                            <span className="text-gray-300">—</span>
                          )}
                        </td>
                        <td className="px-5 py-3 text-xs text-gray-500 max-w-[240px]">
                          {log.detalle ? (
                            <pre className="whitespace-pre-wrap break-all font-mono text-[0.6rem] leading-relaxed">
                              {JSON.stringify(log.detalle, null, 2)}
                            </pre>
                          ) : (
                            <span className="text-gray-300">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="divide-y divide-gray-50 md:hidden">
              {(logs ?? []).map((log) => {
                const actor = log.user_id ? userMap.get(log.user_id) : null;
                return (
                  <div key={log.id} className="px-4 py-3.5 space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex rounded-full bg-[#9333EA]/10 px-2.5 py-1 text-[0.65rem] font-bold text-[#7C3AED]">
                        {log.accion}
                      </span>
                      <span className="text-[0.65rem] text-gray-300">
                        {new Date(log.created_at).toLocaleString("es-AR", {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      <span className="font-semibold">Entidad:</span> {log.entidad}
                    </p>
                    {actor && (
                      <p className="text-xs text-gray-600">
                        <span className="font-semibold">Por:</span> {actor.nombre} ({actor.email})
                      </p>
                    )}
                    {log.detalle && (
                      <pre className="rounded-lg bg-gray-50 p-2 text-[0.6rem] font-mono whitespace-pre-wrap break-all leading-relaxed text-gray-500">
                        {JSON.stringify(log.detalle, null, 2)}
                      </pre>
                    )}
                  </div>
                );
              })}
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
