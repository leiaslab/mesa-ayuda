"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Step = "idle" | "confirm1" | "confirm2" | "done";

export default function SuperadminResetButton() {
  const router = useRouter();
  const [step, setStep]         = useState<Step>("idle");
  const [input, setInput]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [deleted, setDeleted]   = useState(0);

  const handleReset = async () => {
    if (input.trim() !== "CONFIRMAR") return;
    setLoading(true);
    setError(null);

    const res = await fetch("/api/superadmin/reset-reclamos", { method: "DELETE" });
    const json = await res.json().catch(() => ({}));

    if (res.ok) {
      setDeleted(json.eliminados ?? 0);
      setStep("done");
      router.refresh();
    } else {
      setError(json.error ?? "Error al eliminar los reclamos.");
    }
    setLoading(false);
  };

  const close = () => {
    setStep("idle");
    setInput("");
    setError(null);
  };

  return (
    <>
      <button
        onClick={() => setStep("confirm1")}
        className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100"
      >
        Reset — Eliminar todos los reclamos de prueba
      </button>

      {/* Modal 1 — Confirmación inicial */}
      {step === "confirm1" && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) close(); }}
        >
          <div className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-2xl">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <h2 className="text-base font-extrabold text-gray-900">Eliminar todos los reclamos</h2>
            <p className="mt-2 text-sm text-gray-500">
              Esta acción eliminará <strong>permanentemente todos los reclamos</strong> de la base de datos.
              No se puede deshacer.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={close}
                className="flex-1 rounded-2xl border border-gray-200 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={() => setStep("confirm2")}
                className="flex-1 rounded-2xl bg-red-600 py-3 text-sm font-bold text-white hover:bg-red-700"
              >
                Continuar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2 — Escribir CONFIRMAR */}
      {step === "confirm2" && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget && !loading) close(); }}
        >
          <div className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-2xl">
            <h2 className="text-base font-extrabold text-gray-900">Confirmación final</h2>
            <p className="mt-2 text-sm text-gray-500">
              Escribí <span className="font-mono font-bold text-red-600">CONFIRMAR</span> para proceder.
            </p>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="CONFIRMAR"
              className="mt-4 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-mono outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
              autoFocus
            />
            {error && (
              <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
                {error}
              </p>
            )}
            <div className="mt-5 flex gap-3">
              <button
                onClick={close}
                disabled={loading}
                className="flex-1 rounded-2xl border border-gray-200 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleReset}
                disabled={loading || input.trim() !== "CONFIRMAR"}
                className="flex-1 rounded-2xl bg-red-600 py-3 text-sm font-bold text-white hover:bg-red-700 disabled:opacity-40"
              >
                {loading ? "Eliminando..." : "Eliminar todo"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal done */}
      {step === "done" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-2xl text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 mx-auto">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h2 className="text-base font-extrabold text-gray-900">Reclamos eliminados</h2>
            <p className="mt-2 text-sm text-gray-500">
              Se eliminaron <strong>{deleted}</strong> reclamo{deleted !== 1 ? "s" : ""} correctamente.
            </p>
            <button
              onClick={close}
              className="mt-6 w-full rounded-2xl py-3 text-sm font-bold text-white"
              style={{ background: "linear-gradient(135deg, #4C1182 0%, #9333EA 100%)" }}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
