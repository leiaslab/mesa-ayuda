"use client";

import { useState, useRef } from "react";

// ─── Tipos ───────────────────────────────────────────────────────────────────

type ReclamoData = {
  categoria: string;
  subcategoria: string;
  nombre: string;
  dni: string;
  direccion: string;
  entreCalles: string;
  barrio: string;
  descripcion: string;
  foto: File | null;
};

type Errors = Partial<Record<keyof ReclamoData, string>>;

type Step = 1 | 2 | 3 | 4 | 5;

// ─── Constantes ──────────────────────────────────────────────────────────────

const TOTAL_STEPS = 5;

const SUBCATEGORIAS: Record<string, string[]> = {
  calles:      ["Baches", "Cordones", "Veredas", "Señalización", "Otro"],
  alumbrado:   ["Sin luz", "Poste caído", "Luminaria rota", "Otro"],
  aguas:       ["Pérdida en la vía", "Cloaca desbordada", "Sin agua", "Otro"],
  basura:      ["No pasa el camión", "Contenedor lleno", "Basura en vereda", "Otro"],
  inundacion:  ["Calle anegada", "Desagüe tapado", "Sótano inundado", "Otro"],
  inseguridad: ["Zona sin iluminación", "Espacio abandonado", "Otro"],
  otros:       ["Otro"],
};

const CATEGORIA_LABELS: Record<string, string> = {
  calles:      "Calles",
  alumbrado:   "Alumbrado",
  aguas:       "Aguas",
  basura:      "Basura",
  inundacion:  "Inundación",
  inseguridad: "Inseguridad",
  otros:       "Otros",
};

const CATEGORIA_ICONS: Record<string, string> = {
  calles:      "🛣️",
  alumbrado:   "💡",
  aguas:       "💧",
  basura:      "🗑️",
  inundacion:  "🌊",
  inseguridad: "🔒",
  otros:       "📋",
};

// ─── Sub-componentes ──────────────────────────────────────────────────────────

function StepBar({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((s) => (
        <div key={s} className="flex items-center gap-1.5">
          <div
            className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all duration-300 ${
              s < current
                ? "bg-[#6011E8] text-white"
                : s === current
                ? "bg-[#32105B] text-white scale-110 shadow-md"
                : "bg-gray-100 text-gray-400"
            }`}
          >
            {s < current ? (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : s}
          </div>
          {s < TOTAL_STEPS && (
            <div
              className={`h-0.5 w-5 rounded-full transition-all duration-300 ${
                s < current ? "bg-[#6011E8]" : "bg-gray-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[0.7rem] font-bold uppercase tracking-widest text-gray-400">
        {label}
      </label>
      {children}
      {error && (
        <p className="flex items-center gap-1 text-xs font-medium text-red-500">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}

function inputCls(hasError: boolean) {
  return [
    "w-full rounded-xl px-4 py-3 text-sm border outline-none transition-all duration-200",
    "placeholder:text-gray-300 text-gray-800",
    hasError
      ? "border-red-300 bg-red-50 focus:ring-2 focus:ring-red-200"
      : "border-gray-200 bg-white focus:border-[#6011E8] focus:ring-2 focus:ring-[#6011E8]/15",
  ].join(" ");
}

function ResumenRow({
  label,
  value,
  multiline,
}: {
  label: string;
  value: string;
  multiline?: boolean;
}) {
  if (!value) return null;
  return (
    <div className="flex gap-3 px-4 py-3 border-b border-gray-100 last:border-0">
      <span className="w-24 flex-shrink-0 pt-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-gray-400">
        {label}
      </span>
      <span
        className={`flex-1 text-sm font-medium text-[#32105B] ${multiline ? "leading-relaxed" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

interface ReclamoWizardProps {
  categoria: string;
  onClose: () => void;
}

export default function ReclamoWizard({ categoria, onClose }: ReclamoWizardProps) {
  const [step, setStep] = useState<Step>(1);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [data, setData] = useState<ReclamoData>({
    categoria,
    subcategoria: "",
    nombre: "",
    dni: "",
    direccion: "",
    entreCalles: "",
    barrio: "",
    descripcion: "",
    foto: null,
  });

  const update = (field: keyof ReclamoData, value: string | File | null) => {
    setData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const e: Errors = {};

    if (step === 2 && !data.subcategoria) {
      e.subcategoria = "Seleccioná una subcategoría para continuar";
    }

    if (step === 3) {
      if (!data.nombre.trim()) e.nombre = "El nombre es requerido";
      if (!data.dni.trim()) {
        e.dni = "El DNI es requerido";
      } else if (!/^\d{6,8}$/.test(data.dni.replace(/\s|\./g, ""))) {
        e.dni = "Ingresá un DNI válido";
      }
      if (!data.direccion.trim()) e.direccion = "La dirección es requerida";
      if (!data.barrio.trim()) e.barrio = "El barrio es requerido";
      if (!data.descripcion.trim()) {
        e.descripcion = "La descripción es requerida";
      } else if (data.descripcion.trim().length < 20) {
        e.descripcion = "Describí el problema con más detalle (mínimo 20 caracteres)";
      }
    }

    if (Object.keys(e).length) {
      setErrors(e);
      return false;
    }
    return true;
  };

  const next = () => { if (validate()) setStep((s) => Math.min(s + 1, TOTAL_STEPS) as Step); };
  const back = () => setStep((s) => Math.max(s - 1, 1) as Step);

  const handleFoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) return;
    update("foto", file);
    const reader = new FileReader();
    reader.onload = (ev) => setFotoPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    console.log("✅ Reclamo enviado:", data);
    // TODO: conectar con Supabase
    setSubmitted(true);
  };

  const catLabel = CATEGORIA_LABELS[categoria] ?? categoria;
  const catIcon  = CATEGORIA_ICONS[categoria]  ?? "📋";
  const subcats  = SUBCATEGORIAS[categoria]    ?? ["Otro"];

  // ── Pantalla de éxito ──
  if (submitted) {
    return (
      <Overlay onClose={onClose}>
        <div className="flex flex-col items-center gap-6 py-8 px-6 text-center">
          <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center text-4xl">
            ✅
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-[#32105B]">¡Reclamo enviado!</h3>
            <p className="mt-2 text-sm text-gray-500 leading-relaxed max-w-xs">
              Tu reclamo fue registrado. En breve recibirás un número de seguimiento.
            </p>
          </div>
          <div className="w-full bg-[#F8F5FF] rounded-2xl px-5 py-4 text-left">
            <p className="text-xs font-bold uppercase tracking-widest text-[#6011E8] mb-1">Categoría</p>
            <p className="font-bold text-[#32105B]">{catIcon} {catLabel} — {data.subcategoria}</p>
          </div>
          <button
            onClick={onClose}
            className="w-full py-3.5 rounded-2xl text-sm font-bold text-white"
            style={{ background: "linear-gradient(135deg, #32105B 0%, #6011E8 100%)" }}
          >
            Cerrar
          </button>
        </div>
      </Overlay>
    );
  }

  return (
    <Overlay onClose={onClose}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div>
          <h2 className="text-base font-extrabold text-[#32105B]">
            {catIcon} {catLabel}
          </h2>
          <p className="text-[0.7rem] text-gray-400 mt-0.5">
            Paso {step} de {TOTAL_STEPS}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <StepBar current={step} />
          <button
            onClick={onClose}
            className="ml-2 flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            aria-label="Cerrar"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Body scrollable */}
      <div className="flex-1 overflow-y-auto px-6 py-6">

        {/* STEP 1 — Confirmación de categoría */}
        {step === 1 && (
          <div className="flex flex-col items-center gap-6 text-center py-4">
            <div className="w-20 h-20 rounded-3xl bg-[#F3EEFF] flex items-center justify-center text-4xl shadow-sm">
              {catIcon}
            </div>
            <div>
              <h3 className="text-2xl font-extrabold text-[#32105B]">{catLabel}</h3>
              <p className="mt-2 text-sm text-gray-500 leading-relaxed max-w-xs">
                Vas a registrar un reclamo relacionado con el estado de las calles del barrio.
              </p>
            </div>
            <div className="w-full rounded-2xl bg-[#F8F5FF] px-5 py-4 text-left border border-[#EDE4FA]">
              <p className="text-[0.65rem] font-bold uppercase tracking-widest text-[#6011E8] mb-1">
                Categoría seleccionada
              </p>
              <p className="text-base font-bold text-[#32105B]">{catIcon} {catLabel}</p>
            </div>
          </div>
        )}

        {/* STEP 2 — Subcategoría */}
        {step === 2 && (
          <div className="flex flex-col gap-5">
            <div>
              <h3 className="text-xl font-extrabold text-[#32105B]">¿Cuál es el problema?</h3>
              <p className="mt-1 text-sm text-gray-400">Seleccioná el tipo de problema</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {subcats.map((sub) => (
                <button
                  key={sub}
                  onClick={() => update("subcategoria", sub)}
                  className={`rounded-2xl p-4 text-sm font-semibold text-left transition-all duration-200 ${
                    data.subcategoria === sub
                      ? "bg-[#32105B] text-white shadow-lg shadow-[#32105B]/20 scale-[1.02]"
                      : "bg-gray-50 text-gray-700 border border-gray-100 hover:bg-[#F3EEFF] hover:text-[#32105B] hover:border-[#DDD0F5]"
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
            {errors.subcategoria && (
              <p className="flex items-center gap-1.5 text-sm font-medium text-red-500">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                </svg>
                {errors.subcategoria}
              </p>
            )}
          </div>
        )}

        {/* STEP 3 — Formulario */}
        {step === 3 && (
          <div className="flex flex-col gap-4">
            <div>
              <h3 className="text-xl font-extrabold text-[#32105B]">Tus datos y ubicación</h3>
              <p className="mt-1 text-sm text-gray-400">Los campos con * son obligatorios</p>
            </div>

            <Field label="Nombre y apellido *" error={errors.nombre}>
              <input type="text" placeholder="Juan Pérez" value={data.nombre}
                onChange={(e) => update("nombre", e.target.value)}
                className={inputCls(!!errors.nombre)} />
            </Field>

            <Field label="DNI *" error={errors.dni}>
              <input type="text" placeholder="12345678" value={data.dni} maxLength={9}
                onChange={(e) => update("dni", e.target.value.replace(/\D/g, ""))}
                className={inputCls(!!errors.dni)} />
            </Field>

            <Field label="Dirección y altura *" error={errors.direccion}>
              <input type="text" placeholder="Av. Mitre 1234" value={data.direccion}
                onChange={(e) => update("direccion", e.target.value)}
                className={inputCls(!!errors.direccion)} />
            </Field>

            <Field label="Entre calles">
              <input type="text" placeholder="Ej: San Martín y Belgrano" value={data.entreCalles}
                onChange={(e) => update("entreCalles", e.target.value)}
                className={inputCls(false)} />
            </Field>

            <Field label="Barrio *" error={errors.barrio}>
              <input type="text" placeholder="Nombre del barrio" value={data.barrio}
                onChange={(e) => update("barrio", e.target.value)}
                className={inputCls(!!errors.barrio)} />
            </Field>

            <Field label="Descripción del problema *" error={errors.descripcion}>
              <textarea placeholder="Describí detalladamente el problema que encontraste..."
                value={data.descripcion} rows={4}
                onChange={(e) => update("descripcion", e.target.value)}
                className={`${inputCls(!!errors.descripcion)} resize-none leading-relaxed`} />
              <p className="text-right text-[0.65rem] text-gray-300">
                {data.descripcion.length}/20 mínimo
              </p>
            </Field>
          </div>
        )}

        {/* STEP 4 — Foto */}
        {step === 4 && (
          <div className="flex flex-col gap-5">
            <div>
              <h3 className="text-xl font-extrabold text-[#32105B]">Foto del problema</h3>
              <p className="mt-1 text-sm text-gray-400">
                Opcional pero muy útil para gestionar tu reclamo
              </p>
            </div>

            {fotoPreview ? (
              <div className="relative rounded-2xl overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={fotoPreview} alt="Preview" className="w-full object-cover max-h-64 rounded-2xl" />
                <button
                  onClick={() => { update("foto", null); setFotoPreview(null); }}
                  className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md transition-transform hover:scale-110"
                  aria-label="Eliminar foto"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#32105B" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M18 6L6 18M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-[#DDD0F5] bg-[#FDFAFF] p-10 text-center transition-all duration-200 hover:border-[#6011E8] hover:bg-[#F8F5FF]"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EDE4FA]">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#6011E8" strokeWidth="1.8">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" strokeLinecap="round"/>
                    <polyline points="17 8 12 3 7 8" strokeLinecap="round" strokeLinejoin="round"/>
                    <line x1="12" y1="3" x2="12" y2="15" strokeLinecap="round"/>
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-[#32105B]">Tocá para subir una foto</p>
                  <p className="mt-1 text-xs text-gray-400">JPG o PNG, hasta 10 MB</p>
                </div>
              </button>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFoto}
            />
          </div>
        )}

        {/* STEP 5 — Confirmación */}
        {step === 5 && (
          <div className="flex flex-col gap-5">
            <div>
              <h3 className="text-xl font-extrabold text-[#32105B]">Confirmá tu reclamo</h3>
              <p className="mt-1 text-sm text-gray-400">Revisá la información antes de enviar</p>
            </div>

            <div className="rounded-2xl bg-gray-50 overflow-hidden border border-gray-100">
              <ResumenRow label="Categoría"    value={`${catIcon} ${catLabel}`} />
              <ResumenRow label="Subcategoría" value={data.subcategoria} />
              <ResumenRow label="Nombre"       value={data.nombre} />
              <ResumenRow label="DNI"          value={data.dni} />
              <ResumenRow label="Dirección"    value={data.direccion} />
              <ResumenRow label="Entre calles" value={data.entreCalles} />
              <ResumenRow label="Barrio"       value={data.barrio} />
              <ResumenRow label="Descripción"  value={data.descripcion} multiline />
            </div>

            {fotoPreview && (
              <div>
                <p className="mb-2 text-[0.65rem] font-bold uppercase tracking-widest text-gray-400">
                  Foto adjunta
                </p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={fotoPreview} alt="Foto del reclamo"
                  className="w-full rounded-2xl object-cover max-h-44" />
              </div>
            )}
          </div>
        )}

      </div>

      {/* Footer */}
      <div className="flex gap-3 border-t border-gray-100 px-6 py-4">
        {step > 1 && (
          <button
            onClick={back}
            className="flex-1 rounded-2xl border border-gray-200 py-3.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50"
          >
            Volver
          </button>
        )}
        {step < TOTAL_STEPS ? (
          <button
            onClick={next}
            className="flex-1 rounded-2xl py-3.5 text-sm font-bold text-white shadow-md transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
            style={{ background: "linear-gradient(135deg, #32105B 0%, #6011E8 100%)" }}
          >
            Continuar →
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="flex-1 rounded-2xl py-3.5 text-sm font-bold text-white shadow-md transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
            style={{ background: "linear-gradient(135deg, #32105B 0%, #6011E8 100%)" }}
          >
            Enviar Reclamo ✓
          </button>
        )}
      </div>
    </Overlay>
  );
}

// ─── Overlay wrapper ──────────────────────────────────────────────────────────

function Overlay({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm sm:items-center"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative flex w-full max-w-lg flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl"
        style={{ maxHeight: "92vh" }}>
        {children}
      </div>
    </div>
  );
}
