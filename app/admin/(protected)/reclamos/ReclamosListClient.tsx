"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { StatusBadge, PrioridadBadge } from "@/components/admin/StatusBadge";
import type { ReclamoCompleto } from "@/types/database";

type Props = {
  reclamos:      ReclamoCompleto[];
  isSuperAdmin:  boolean;
};

export default function ReclamosListClient({ reclamos, isSuperAdmin }: Props) {
  const router = useRouter();
  const [confirmId, setConfirmId]       = useState<string | null>(null);
  const [confirmNum, setConfirmNum]     = useState<string>("");
  const [deleting, setDeleting]         = useState(false);
  const [deleteError, setDeleteError]   = useState<string | null>(null);

  const openConfirm = (id: string, num: string) => {
    setConfirmId(id);
    setConfirmNum(num);
    setDeleteError(null);
  };

  const handleDelete = async () => {
    if (!confirmId) return;
    setDeleting(true);
    setDeleteError(null);

    const res = await fetch(`/api/admin/reclamos/${confirmId}`, { method: "DELETE" });

    if (res.ok) {
      setConfirmId(null);
      router.refresh();
    } else {
      const json = await res.json().catch(() => ({}));
      setDeleteError(json.error ?? "Error al eliminar el reclamo.");
    }
    setDeleting(false);
  };

  return (
    <>
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
              <div key={r.id} className="flex items-start justify-between gap-3 px-4 py-3.5">
                <Link
                  href={`/admin/reclamos/${r.id}`}
                  className="min-w-0 flex-1 hover:opacity-80 active:opacity-60"
                >
                  <p className="font-mono text-xs font-bold text-[#9333EA]">{r.numero_seguimiento}</p>
                  <p className="mt-0.5 truncate text-sm font-medium text-gray-800">{r.vecino_nombre}</p>
                  <p className="text-xs text-gray-400">{r.categoria} · {r.vecino_barrio}</p>
                  <div className="mt-1.5 flex items-center gap-2">
                    <StatusBadge estado={r.estado} />
                    <PrioridadBadge prioridad={r.prioridad} />
                  </div>
                </Link>
                <div className="flex flex-shrink-0 flex-col items-end gap-1.5">
                  <p className="text-[0.65rem] text-gray-300">
                    {new Date(r.created_at).toLocaleDateString("es-AR", {
                      day: "2-digit",
                      month: "short",
                    })}
                  </p>
                  {isSuperAdmin && (
                    <button
                      onClick={() => openConfirm(r.id, r.numero_seguimiento)}
                      className="rounded-lg bg-red-50 px-2.5 py-1 text-[0.65rem] font-bold text-red-600 hover:bg-red-100"
                    >
                      Eliminar
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Tabla en desktop */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  {[
                    "N° seguimiento", "Vecino", "Categoría", "Barrio",
                    "Prioridad", "Estado", "Fecha",
                    ...(isSuperAdmin ? [""] : []),
                  ].map((heading, i) => (
                    <th
                      key={i}
                      className="px-5 py-3 text-left text-[0.65rem] font-bold uppercase tracking-widest text-gray-400"
                    >
                      {heading}
                    </th>
                  ))}
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
                    {isSuperAdmin && (
                      <td className="px-5 py-3.5">
                        <button
                          onClick={() => openConfirm(r.id, r.numero_seguimiento)}
                          className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-100"
                        >
                          Eliminar
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Modal de confirmación */}
      {confirmId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget && !deleting) setConfirmId(null); }}
        >
          <div className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-2xl">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                <path d="M10 11v6M14 11v6" />
                <path d="M9 6V4h6v2" />
              </svg>
            </div>
            <h2 className="text-base font-extrabold text-gray-900">Eliminar reclamo</h2>
            <p className="mt-2 text-sm text-gray-500">
              ¿Estás seguro que querés eliminar el reclamo{" "}
              <span className="font-bold text-[#9333EA]">{confirmNum}</span>?
              Esta acción no se puede deshacer.
            </p>

            {deleteError && (
              <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
                {deleteError}
              </p>
            )}

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setConfirmId(null)}
                disabled={deleting}
                className="flex-1 rounded-2xl border border-gray-200 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 rounded-2xl bg-red-600 py-3 text-sm font-bold text-white hover:bg-red-700 disabled:opacity-60"
              >
                {deleting ? "Eliminando..." : "Sí, eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
