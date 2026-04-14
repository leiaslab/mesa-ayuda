"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { StatusBadge, PrioridadBadge } from "@/components/admin/StatusBadge";
import type { ReclamoEstado, ReclamoPrioridad } from "@/types/database";
import { ESTADO_LABELS, PRIORIDAD_LABELS } from "@/types/database";
import { generarPDF } from "@/lib/documents/pdf";

const ESTADOS  = Object.entries(ESTADO_LABELS)    as [ReclamoEstado, string][];
const PRIORIDADES = Object.entries(PRIORIDAD_LABELS) as [ReclamoPrioridad, string][];

type Props = {
  reclamoId:        string;
  estadoActual:     ReclamoEstado;
  prioridadActual:  ReclamoPrioridad;
  observaciones:    string;
  numeroSeguimiento: string;
  userId:           string;
};

export default function ReclamoDetailClient({
  reclamoId,
  estadoActual,
  prioridadActual,
  observaciones,
  numeroSeguimiento,
  userId,
}: Props) {
  const router   = useRouter();
  const supabase = createClient();

  const [estado,    setEstado]    = useState<ReclamoEstado>(estadoActual);
  const [prioridad, setPrioridad] = useState<ReclamoPrioridad>(prioridadActual);
  const [obs,       setObs]       = useState(observaciones);
  const [loading,   setLoading]   = useState(false);
  const [genLoading, setGenLoading] = useState(false);
  const [saved,     setSaved]     = useState(false);
  const [error,     setError]     = useState<string | null>(null);

  const handleSave = async () => {
    setLoading(true);
    setError(null);

    const { error } = await supabase
      .from("reclamos")
      .update({
        estado,
        prioridad,
        observaciones_internas: obs || null,
      })
      .eq("id", reclamoId);

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

  const handleGenerarPDF = async () => {
    setGenLoading(true);
    try {
      await generarPDF(reclamoId, numeroSeguimiento, supabase, userId);
      router.refresh();
    } catch (e) {
      setError("Error al generar el PDF");
    } finally {
      setGenLoading(false);
    }
  };

  const handleGenerarDoc = async (tipo: "word" | "excel") => {
    setGenLoading(true);
    try {
      const res = await fetch("/api/documentos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reclamo_id: reclamoId, tipo, usuario_id: userId }),
      });
      if (!res.ok) throw new Error();
      router.refresh();
    } catch {
      setError(`Error al generar el ${tipo}`);
    } finally {
      setGenLoading(false);
    }
  };

  return (
    <section className="rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-50">
        <h2 className="text-sm font-bold text-[#32105B]">Gestión</h2>
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
            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-[#6011E8]"
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
            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-[#6011E8]"
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
            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none resize-none focus:border-[#6011E8] focus:ring-2 focus:ring-[#6011E8]/10 placeholder:text-gray-300"
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
          style={{ background: "linear-gradient(135deg, #32105B 0%, #6011E8 100%)" }}
        >
          {saved ? "✓ Guardado" : loading ? "Guardando..." : "Guardar cambios"}
        </button>

        {/* Separador */}
        <div className="border-t border-gray-100 pt-3">
          <p className="text-[0.65rem] font-bold uppercase tracking-widest text-gray-400 mb-3">
            Generar documento
          </p>
          <div className="flex flex-col gap-2">
            <button
              onClick={handleGenerarPDF}
              disabled={genLoading}
              className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-60 transition-colors"
            >
              <span>📄</span> Generar PDF
            </button>
            <button
              onClick={() => handleGenerarDoc("word")}
              disabled={genLoading}
              className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-60 transition-colors"
            >
              <span>📝</span> Generar Word
            </button>
            <button
              onClick={() => handleGenerarDoc("excel")}
              disabled={genLoading}
              className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-60 transition-colors"
            >
              <span>📊</span> Generar Excel
            </button>
          </div>
          {genLoading && (
            <p className="mt-2 text-xs text-gray-400 text-center">Generando documento...</p>
          )}
        </div>
      </div>
    </section>
  );
}
