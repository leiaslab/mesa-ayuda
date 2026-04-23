"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import LogoLLA from "@/components/LogoLLA";
import { StatusBadge } from "@/components/admin/StatusBadge";
import type { ReclamoCompleto } from "@/types/database";
import { getReclamoDisplayData } from "@/lib/reclamo-details";

export default function ConsultaPage() {
  const [numero, setNumero] = useState("");
  const [dni, setDni] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reclamo, setReclamo] = useState<ReclamoCompleto | null>(null);

  const handleBuscar = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setReclamo(null);

    const supabase = createClient();
    const { data, error: supaError } = await supabase
      .from("reclamos_completos")
      .select("*")
      .eq("numero_seguimiento", numero.trim().toUpperCase())
      .single();

    if (supaError || !data) {
      setError("No encontramos un reclamo con ese número. Verificá que esté bien escrito.");
      setLoading(false);
      return;
    }

    if (dni.trim() && data.vecino_dni !== dni.trim()) {
      setError("El DNI no coincide con el reclamo. Verificá los datos.");
      setLoading(false);
      return;
    }

    setReclamo(data as ReclamoCompleto);
    setLoading(false);
  };

  const detalle = reclamo
    ? getReclamoDisplayData({
        descripcion: reclamo.descripcion,
        direccionDenunciante: reclamo.vecino_direccion,
      })
    : null;

  return (
    <div className="flex min-h-screen flex-col" style={{ background: "linear-gradient(180deg, #2D0A69 0%, #6B21A8 100%)" }}>
      <header className="flex items-center justify-between px-6 py-5 lg:px-10">
        <Link href="/"><LogoLLA className="h-auto w-[90px]" /></Link>
        <Link href="/" className="text-xs font-semibold text-white/60 transition-colors hover:text-white">← Volver al inicio</Link>
      </header>

      <div className="flex flex-1 flex-col items-center justify-center px-4 py-10">
        <div className="w-full max-w-md space-y-6">
          <div className="rounded-3xl bg-white p-8 shadow-2xl">
            <div className="mb-6 text-center">
              <span className="text-4xl">🔍</span>
              <h1 className="mt-3 text-xl font-extrabold text-[#4C1182]">Consultar estado de reclamo</h1>
              <p className="mt-1 text-sm text-gray-400">Ingresá tu número de seguimiento</p>
            </div>

            <form onSubmit={handleBuscar} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[0.65rem] font-bold uppercase tracking-widest text-gray-400">Número de seguimiento *</label>
                <input type="text" value={numero} onChange={(event) => setNumero(event.target.value)} placeholder="AVA-2026-000001" required className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 font-mono text-sm uppercase text-gray-800 outline-none focus:border-[#9333EA] focus:ring-2 focus:ring-[#9333EA]/15 placeholder:text-gray-300 placeholder:normal-case" />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[0.65rem] font-bold uppercase tracking-widest text-gray-400">DNI (opcional, para verificar identidad)</label>
                <input type="text" value={dni} onChange={(event) => setDni(event.target.value.replace(/\D/g, ""))} placeholder="12345678" maxLength={8} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none focus:border-[#9333EA] focus:ring-2 focus:ring-[#9333EA]/15 placeholder:text-gray-300" />
              </div>

              {error && <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">{error}</div>}

              <button type="submit" disabled={loading} className="w-full rounded-2xl py-3.5 text-sm font-bold text-white shadow-md transition-all hover:opacity-90 disabled:opacity-60" style={{ background: "linear-gradient(135deg, #4C1182 0%, #9333EA 100%)" }}>{loading ? "Buscando..." : "Consultar estado"}</button>
            </form>
          </div>

          {reclamo && detalle && (
            <div className="space-y-4 rounded-3xl bg-white p-6 shadow-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[0.65rem] font-bold uppercase tracking-widest text-[#9333EA]">Número de seguimiento</p>
                  <p className="font-mono text-lg font-extrabold text-[#4C1182]">{reclamo.numero_seguimiento}</p>
                </div>
                <StatusBadge estado={reclamo.estado} />
              </div>

              <div className="divide-y divide-gray-50">
                <ResultRow label="Categoría" value={reclamo.categoria} />
                <ResultRow label="Tipo" value={reclamo.subcategoria} />
                <ResultRow label="Problema" value={detalle.direccionProblema} />
                <ResultRow label="Barrio" value={reclamo.vecino_barrio} />
                <ResultRow label="Fecha" value={new Date(reclamo.created_at).toLocaleDateString("es-AR", { day: "2-digit", month: "long", year: "numeric" })} />
                <ResultRow label="Actualizado" value={new Date(reclamo.updated_at).toLocaleDateString("es-AR", { day: "2-digit", month: "long", year: "numeric" })} />
              </div>

              <div className="rounded-2xl border border-[#EDE4FA] bg-[#F8F5FF] px-4 py-4">
                <p className="mb-1 text-[0.65rem] font-bold uppercase tracking-widest text-[#9333EA]">Descripción</p>
                <p className="text-sm leading-relaxed text-gray-700">{detalle.descripcion}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ResultRow({ label, value }: { label: string; value: string }) {
  return <div className="flex gap-4 py-3"><span className="w-24 flex-shrink-0 pt-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-gray-400">{label}</span><span className="flex-1 text-sm font-medium text-gray-700">{value}</span></div>;
}
