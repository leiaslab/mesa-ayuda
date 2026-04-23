"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { StatusBadge, PrioridadBadge } from "@/components/admin/StatusBadge";
import type { ReclamoCompleto, ReclamoEstado, ReclamoPrioridad } from "@/types/database";
import { ESTADO_LABELS, PRIORIDAD_LABELS } from "@/types/database";

const ESTADOS  = Object.entries(ESTADO_LABELS)    as [ReclamoEstado, string][];
const PRIORIDADES = Object.entries(PRIORIDAD_LABELS) as [ReclamoPrioridad, string][];

type Props = {
  reclamo:          ReclamoCompleto;
  estadoActual:     ReclamoEstado;
  prioridadActual:  ReclamoPrioridad;
  observaciones:    string;
  userId:           string;
};

export default function ReclamoDetailClient({
  reclamo,
  estadoActual,
  prioridadActual,
  observaciones,
  userId,
}: Props) {
  const router   = useRouter();

  const [estado,    setEstado]    = useState<ReclamoEstado>(estadoActual);
  const [prioridad, setPrioridad] = useState<ReclamoPrioridad>(prioridadActual);
  const [obs,       setObs]       = useState(observaciones);
  const [loading,   setLoading]   = useState(false);
  const [genLoading, setGenLoading] = useState<"pdf" | "word" | "excel" | null>(null);
  const [saved,     setSaved]     = useState(false);
  const [error,     setError]     = useState<string | null>(null);

  const handleSave = async () => {
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase
      .from("reclamos")
      .update({
        estado,
        prioridad,
        observaciones_internas: obs || null,
      })
      .eq("id", reclamo.id);

    if (error) {
      setError("Error al guardar los cambios");
    } else {
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        router.refresh();
      }, 1500);
    }
    setLoading(false);
  };

  const handleGenerar = async (tipo: "pdf" | "word" | "excel") => {
    setGenLoading(tipo);
    setError(null);
    try {
      if (tipo === "pdf") {
        const { generarPDFHCD } = await import("@/lib/documents/pdf-client");
        await generarPDFHCD(reclamo);
      } else if (tipo === "word") {
        const { generarWordHCD } = await import("@/lib/documents/word-client");
        await generarWordHCD(reclamo);
      } else {
        const { generarExcelHCD } = await import("@/lib/documents/excel-client");
        await generarExcelHCD(reclamo);
      }
    } catch {
      setError(`Error al generar el ${tipo.toUpperCase()}`);
    } finally {
      setGenLoading(null);
    }
  };

  return (
    <section className="rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-50">
        <h2 className="text-sm font-bold text-[#4C1182]">Gestión</h2>
      </div>

      <div className="p-5 space-y-4">
        {/* Estado */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[0.65rem] font-bold uppercase tracking-widest text-gray-400">
            Estado
          </label>
          <select
            value={estado}
            onChange={(e) => setEstado(e.target.value as ReclamoEstado)}
            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-[#9333EA]"
          >
            {ESTADOS.map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
        </div>

        {/* Prioridad */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[0.65rem] font-bold uppercase tracking-widest text-gray-400">
            Prioridad
          </label>
          <select
            value={prioridad}
            onChange={(e) => setPrioridad(e.target.value as ReclamoPrioridad)}
            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-[#9333EA]"
          >
            {PRIORIDADES.map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
        </div>

        {/* Observaciones */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[0.65rem] font-bold uppercase tracking-widest text-gray-400">
            Observaciones internas
          </label>
          <textarea
            value={obs}
            onChange={(e) => setObs(e.target.value)}
            rows={4}
            placeholder="Notas internas sobre este reclamo..."
            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none resize-none focus:border-[#9333EA] focus:ring-2 focus:ring-[#9333EA]/10 placeholder:text-gray-300"
          />
        </div>

        {error && (
          <p className="rounded-xl bg-red-50 px-3 py-2.5 text-xs font-medium text-red-600">
            {error}
          </p>
        )}

        {/* Guardar */}
        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full rounded-xl py-3 text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-60"
          style={{ background: "linear-gradient(135deg, #4C1182 0%, #9333EA 100%)" }}
        >
          {saved ? "✓ Guardado" : loading ? "Guardando..." : "Guardar cambios"}
        </button>

        {/* Documentos */}
        <div className="border-t border-gray-100 pt-3">
          <p className="text-[0.65rem] font-bold uppercase tracking-widest text-gray-400 mb-3">
            Generar documento
          </p>
          <div className="flex flex-col gap-2">
            {(
              [
                { tipo: "pdf",   icon: "📄", label: "Generar PDF"   },
                { tipo: "word",  icon: "📝", label: "Generar Word"  },
                { tipo: "excel", icon: "📊", label: "Generar Excel" },
              ] as const
            ).map(({ tipo, icon, label }) => (
              <button
                key={tipo}
                onClick={() => handleGenerar(tipo)}
                disabled={genLoading !== null}
                className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-60 transition-colors"
              >
                <span>{icon}</span>
                {genLoading === tipo ? "Generando..." : label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
