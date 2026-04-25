"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { ESTADO_LABELS, PRIORIDAD_LABELS } from "@/types/database";

type Tab = "reclamos" | "usuarios";

const PAGE_SIZE = 20;

export default function BaseDatosPage() {
  const [tab, setTab] = useState<Tab>("reclamos");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const from = page * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    if (tab === "reclamos") {
      let q = supabase
        .from("reclamos_completos")
        .select("id, numero_seguimiento, vecino_nombre, vecino_dni, categoria, subcategoria, estado, prioridad, created_at", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(from, to);
      if (search.trim())
        q = q.or(
          `numero_seguimiento.ilike.%${search}%,vecino_nombre.ilike.%${search}%,vecino_dni.ilike.%${search}%`
        );
      const { data, count } = await q;
      setRows((data as unknown as Record<string, unknown>[]) ?? []);
      setTotal(count ?? 0);
    } else {
      let q = supabase
        .from("users")
        .select("id, nombre, email, rol, activo, created_at", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(from, to);
      if (search.trim())
        q = q.or(`nombre.ilike.%${search}%,email.ilike.%${search}%`);
      const { data, count } = await q;
      setRows((data as unknown as Record<string, unknown>[]) ?? []);
      setTotal(count ?? 0);
    }
    setLoading(false);
  }, [tab, page, search]);

  useEffect(() => {
    setPage(0);
  }, [tab, search]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleExport = async () => {
    setExporting(true);
    try {
      const XLSX = await import("xlsx");
      const supabase = createClient();

      let allRows: Record<string, unknown>[] = [];

      if (tab === "reclamos") {
        let q = supabase
          .from("reclamos_completos")
          .select("numero_seguimiento, vecino_nombre, vecino_dni, vecino_telefono, vecino_email, vecino_direccion, vecino_barrio, categoria, subcategoria, descripcion, estado, prioridad, created_at")
          .order("created_at", { ascending: false });
        if (search.trim())
          q = q.or(
            `numero_seguimiento.ilike.%${search}%,vecino_nombre.ilike.%${search}%,vecino_dni.ilike.%${search}%`
          );
        const { data } = await q;
        allRows = (data as unknown as Record<string, unknown>[]) ?? [];
      } else {
        let q = supabase
          .from("users")
          .select("nombre, email, rol, activo, created_at")
          .order("created_at", { ascending: false });
        if (search.trim())
          q = q.or(`nombre.ilike.%${search}%,email.ilike.%${search}%`);
        const { data } = await q;
        allRows = (data as unknown as Record<string, unknown>[]) ?? [];
      }

      const cols = COLS[tab];
      const headers = cols.map((c) => c.label);
      const dataRows = allRows.map((row) =>
        cols.map((c) =>
          c.render ? c.render(row[c.key], row) : String(row[c.key] ?? "")
        )
      );

      const ws = XLSX.utils.aoa_to_sheet([headers, ...dataRows]);
      ws["!cols"] = headers.map((h, i) => ({
        wch: Math.max(h.length, ...dataRows.map((r) => String(r[i] ?? "").length), 10),
      }));

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, tab);
      XLSX.writeFile(wb, `${tab}-${new Date().toISOString().slice(0, 10)}.xlsx`);
    } finally {
      setExporting(false);
    }
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);

  const COLS: Record<Tab, { key: string; label: string; render?: (v: unknown, row: Record<string, unknown>) => string }[]> = {
    reclamos: [
      { key: "numero_seguimiento", label: "N° Seguimiento" },
      { key: "vecino_nombre", label: "Vecino" },
      { key: "vecino_dni", label: "DNI" },
      { key: "categoria", label: "Categoría" },
      { key: "subcategoria", label: "Subcategoría" },
      {
        key: "estado",
        label: "Estado",
        render: (v) => ESTADO_LABELS[v as keyof typeof ESTADO_LABELS] ?? String(v),
      },
      {
        key: "prioridad",
        label: "Prioridad",
        render: (v) => PRIORIDAD_LABELS[v as keyof typeof PRIORIDAD_LABELS] ?? String(v),
      },
      {
        key: "created_at",
        label: "Fecha",
        render: (v) => new Date(v as string).toLocaleDateString("es-AR"),
      },
    ],
    usuarios: [
      { key: "nombre", label: "Nombre" },
      { key: "email", label: "Email" },
      { key: "rol", label: "Rol" },
      { key: "activo", label: "Activo", render: (v) => (v ? "Sí" : "No") },
      {
        key: "created_at",
        label: "Creado",
        render: (v) => new Date(v as string).toLocaleDateString("es-AR"),
      },
    ],
  };

  const cols = COLS[tab];

  return (
    <div className="space-y-6 p-6 lg:p-8">
      <div>
        <h1 className="text-2xl font-extrabold text-[#4C1182]">Base de datos</h1>
        <p className="mt-1 text-sm text-gray-400">Visualización de tablas del sistema</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {(["reclamos", "usuarios"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => { setTab(t); setSearch(""); }}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all capitalize ${
              tab === t
                ? "bg-[#4C1182] text-white shadow-sm"
                : "bg-white border border-gray-200 text-gray-600 hover:border-[#9333EA] hover:text-[#4C1182]"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Search + count */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={tab === "reclamos" ? "Buscar por N°, nombre o DNI..." : "Buscar por nombre o email..."}
          className="w-full max-w-sm rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#9333EA] focus:ring-2 focus:ring-[#9333EA]/10"
        />
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400">{total} registro{total !== 1 ? "s" : ""}</span>
          <button
            onClick={handleExport}
            disabled={exporting || rows.length === 0}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 transition-colors hover:border-[#9333EA] hover:text-[#4C1182] disabled:opacity-40"
          >
            {exporting ? "Exportando..." : "Exportar Excel"}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {cols.map((c) => (
                  <th
                    key={c.key}
                    className="whitespace-nowrap px-4 py-3 text-left text-[0.65rem] font-bold uppercase tracking-widest text-gray-400"
                  >
                    {c.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={cols.length} className="py-12 text-center text-sm text-gray-400">
                    Cargando...
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={cols.length} className="py-12 text-center text-sm text-gray-400">
                    Sin resultados
                  </td>
                </tr>
              ) : (
                rows.map((row, i) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50">
                    {cols.map((c) => (
                      <td key={c.key} className="max-w-[220px] truncate px-4 py-3 text-gray-700">
                        {c.render
                          ? c.render(row[c.key], row)
                          : String(row[c.key] ?? "—")}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 disabled:opacity-40 hover:border-[#9333EA] hover:text-[#4C1182]"
            >
              ← Anterior
            </button>
            <span className="text-xs text-gray-400">
              Página {page + 1} de {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 disabled:opacity-40 hover:border-[#9333EA] hover:text-[#4C1182]"
            >
              Siguiente →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
