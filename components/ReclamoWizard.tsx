"use client";
/* eslint-disable @next/next/no-img-element */

import { useRef, useState } from "react";

type ReclamoData = {
  categoria: string;
  subcategoria: string;
  nombre: string;
  apellido: string;
  dni: string;
  fechaNacimiento: string;
  sexo: string;
  telefono: string;
  email: string;
  direccionDenunciante: string;
  direccionProblema: string;
  entreCalles: string;
  barrio: string;
  descripcion: string;
  foto: File | null;
};

type Errors = Partial<Record<keyof ReclamoData, string>>;
type Step = 1 | 2 | 3 | 4 | 5;

const TOTAL_STEPS = 5;
const SUBCATEGORIAS: Record<string, string[]> = {
  calles: ["Baches", "Cordones", "Veredas", "Poda de árboles", "Señalización", "Otro"],
  alumbrado: ["Falta de iluminaria pública", "Reparación de iluminaria", "Otro"],
  aguas: ["Boca de tormenta", "Pérdida en la vía pública", "Cloaca desbordada", "Otro"],
  basura: ["No pasa el camión", "Contenedor lleno", "Basura en vereda", "Otro"],
  inundacion: ["Calle anegada", "Desagüe tapado", "Otro"],
  inseguridad: ["Cámaras que no funcionan", "Falta de presencia policial", "Otro"],
  otros: ["Otro"],
};
const CATEGORIA_LABELS: Record<string, string> = {
  calles: "Calles",
  alumbrado: "Alumbrado",
  aguas: "Aguas",
  basura: "Basura",
  inundacion: "Inundación",
  inseguridad: "Inseguridad",
  otros: "Otros",
};
const CATEGORIA_ICONS: Record<string, string> = {
  calles: "🛣️",
  alumbrado: "💡",
  aguas: "💧",
  basura: "🗑️",
  inundacion: "🌊",
  inseguridad: "🔒",
  otros: "📋",
};
const CATEGORIA_DESCRIPTIONS: Record<string, string> = {
  calles: "Vas a registrar un reclamo vinculado al estado de calles, veredas o arbolado.",
  alumbrado: "Vas a registrar un reclamo relacionado con iluminación pública del barrio.",
  aguas: "Vas a registrar un reclamo por pérdidas, cloacas o boca de tormenta.",
  basura: "Vas a registrar un reclamo vinculado a recolección o residuos en la vía pública.",
  inundacion: "Vas a registrar un reclamo por anegamientos o problemas de desagüe.",
  inseguridad: "Vas a registrar un reclamo vinculado a prevención y seguridad en el barrio.",
  otros: "Vas a registrar un reclamo vecinal para que podamos evaluarlo.",
};

function getTodayDateValue() {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}

function StepBar({ current }: { current: number }) {
  return <div className="flex items-center gap-1.5">{Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((s) => <div key={s} className="flex items-center gap-1.5"><div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all duration-300 ${s < current ? "bg-[#9333EA] text-white" : s === current ? "scale-110 bg-[#4C1182] text-white shadow-md" : "bg-gray-100 text-gray-400"}`}>{s < current ? <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg> : s}</div>{s < TOTAL_STEPS && <div className={`h-0.5 w-5 rounded-full transition-all duration-300 ${s < current ? "bg-[#9333EA]" : "bg-gray-200"}`} />}</div>)}</div>;
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return <div className="flex flex-col gap-1.5"><label className="text-[0.7rem] font-bold uppercase tracking-widest text-gray-400">{label}</label>{children}{error && <p className="flex items-center gap-1 text-xs font-medium text-red-500"><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" /></svg>{error}</p>}</div>;
}

function inputCls(hasError: boolean) {
  return ["w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all duration-200", "placeholder:text-gray-300 text-gray-800", hasError ? "border-red-300 bg-red-50 focus:ring-2 focus:ring-red-200" : "border-gray-200 bg-white focus:border-[#9333EA] focus:ring-2 focus:ring-[#9333EA]/15"].join(" ");
}

function ResumenRow({ label, value, multiline }: { label: string; value: string; multiline?: boolean }) {
  if (!value) return null;
  return <div className="flex gap-3 border-b border-gray-100 px-4 py-3 last:border-0"><span className="w-28 flex-shrink-0 pt-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-gray-400">{label}</span><span className={`flex-1 text-sm font-medium text-[#4C1182] ${multiline ? "leading-relaxed" : ""}`}>{value}</span></div>;
}

function VeredasInfoCard() {
  return <div className="rounded-[24px] border border-[#E7D9FB] bg-[linear-gradient(180deg,#FDFBFF_0%,#F7F2FF_100%)] p-4 shadow-[0_12px_30px_rgba(76,17,130,0.08)]"><div className="rounded-2xl bg-white/80 p-4"><p className="text-[0.68rem] font-bold uppercase tracking-[0.22em] text-[#9333EA]">Veredas: ¿Quién se hace cargo?</p><div className="mt-4 space-y-4 text-sm leading-6 text-[#4b4360]"><div><p className="font-bold text-[#4C1182]">📌 Regla general</p><p className="mt-1">La vereda es responsabilidad del frentista (propietario del inmueble).</p></div><div><p className="font-bold text-[#4C1182]">🏗️ Le corresponde al Municipio o empresa si:</p><ul className="mt-1 space-y-1.5"><li>- La vereda fue rota por una obra pública o intervención</li><li>- El daño lo causó una empresa de servicios</li><li>- AySA</li><li>- Edesur / Metrogas</li><li>- Telecomunicaciones</li><li>- Si el daño es por raíces de árboles</li></ul></div><div><p className="font-bold text-[#4C1182]">⚠️ Importante</p><ul className="mt-1 space-y-1.5"><li>- La responsabilidad depende de quién causó el daño</li><li>- Podés hacer el reclamo para que se evalúe tu caso</li></ul></div></div></div></div>;
}

interface ReclamoWizardProps { categoria: string; onClose: () => void; whatsappUrl: string; }

export default function ReclamoWizard({ categoria, onClose, whatsappUrl }: ReclamoWizardProps) {
  const [step, setStep] = useState<Step>(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitWarning, setSubmitWarning] = useState<string | null>(null);
  const [numeroSeguimiento, setNumeroSeguimiento] = useState<string | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [fotoModerating, setFotoModerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const todayDate = getTodayDateValue();
  const [data, setData] = useState<ReclamoData>({ categoria, subcategoria: "", nombre: "", apellido: "", dni: "", fechaNacimiento: "", sexo: "", telefono: "", email: "", direccionDenunciante: "", direccionProblema: "", entreCalles: "", barrio: "", descripcion: "", foto: null });

  const update = (field: keyof ReclamoData, value: string | File | null) => {
    setData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const nextErrors: Errors = {};
    if (step === 2 && !data.subcategoria) nextErrors.subcategoria = "Seleccioná una subcategoría para continuar";
    if (step === 3) {
      if (!data.nombre.trim()) nextErrors.nombre = "El nombre es requerido";
      if (!data.apellido.trim()) nextErrors.apellido = "El apellido es requerido";
      if (!data.dni.trim()) nextErrors.dni = "El DNI es requerido";
      else if (!/^\d{6,8}$/.test(data.dni.replace(/\s|\./g, ""))) nextErrors.dni = "Ingresá un DNI válido";
      if (!data.fechaNacimiento) nextErrors.fechaNacimiento = "La fecha de nacimiento es requerida";
      else if (data.fechaNacimiento > todayDate) nextErrors.fechaNacimiento = "La fecha de nacimiento no puede ser futura";
      if (!data.telefono.trim()) nextErrors.telefono = "El teléfono es requerido";
      else if (data.telefono.replace(/\s|-/g, "").length < 8) nextErrors.telefono = "Ingresá un teléfono válido (mínimo 8 dígitos)";
      if (data.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) nextErrors.email = "Ingresá un email válido";
      if (!data.direccionDenunciante.trim()) nextErrors.direccionDenunciante = "La dirección del denunciante es requerida";
      if (!data.direccionProblema.trim()) nextErrors.direccionProblema = "La dirección del problema es requerida";
      if (!data.barrio.trim()) nextErrors.barrio = "El barrio es requerido";
      if (!data.descripcion.trim()) nextErrors.descripcion = "La descripción es requerida";
      else if (data.descripcion.trim().length < 20) nextErrors.descripcion = "Describí el problema con más detalle (mínimo 20 caracteres)";
    }
    if (Object.keys(nextErrors).length) { setErrors(nextErrors); return false; }
    return true;
  };

  const next = () => validate() && setStep((current) => Math.min(current + 1, TOTAL_STEPS) as Step);
  const back = () => setStep((current) => Math.max(current - 1, 1) as Step);

  const handleFoto = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) { setErrors((prev) => ({ ...prev, foto: "Solo se permiten imágenes JPG, PNG o WebP" })); event.target.value = ""; return; }
    if (file.size > 10 * 1024 * 1024) { setErrors((prev) => ({ ...prev, foto: "La imagen no puede superar los 10 MB" })); event.target.value = ""; return; }
    setFotoModerating(true);
    setErrors((prev) => ({ ...prev, foto: undefined }));
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = (e) => resolve(e.target?.result as string); reader.onerror = reject; reader.readAsDataURL(file); });
      const base64 = dataUrl.split(",")[1];
      const res = await fetch("/api/moderar-imagen", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ foto_base64: base64, foto_mime: file.type }) });
      if (res.ok) {
        const mod = await res.json();
        if (!mod.apropiada) { setErrors((prev) => ({ ...prev, foto: `La imagen no fue aceptada: ${mod.motivo}. Por favor subí una foto relacionada con tu reclamo.` })); event.target.value = ""; return; }
      }
      update("foto", file);
      setFotoPreview(dataUrl);
    } catch {
      update("foto", file);
      const reader = new FileReader(); reader.onload = (e) => setFotoPreview(e.target?.result as string); reader.readAsDataURL(file);
    } finally {
      setFotoModerating(false);
    }
  };

  const catLabel = CATEGORIA_LABELS[categoria] ?? categoria;
  const catIcon = CATEGORIA_ICONS[categoria] ?? "📋";
  const subcats = SUBCATEGORIAS[categoria] ?? ["Otro"];
  const categoryDescription = CATEGORIA_DESCRIPTIONS[categoria] ?? "Vas a registrar un reclamo vecinal.";
  const isVeredasSelected = categoria === "calles" && data.subcategoria === "Veredas";
  const handleGuardarComprobante = () => {
    const width = 720;
    const height = 960;
    const scale = 2;
    const canvas = document.createElement("canvas");
    canvas.width = width * scale;
    canvas.height = height * scale;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.scale(scale, scale);
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#2D0A69");
    gradient.addColorStop(0.55, "#5B17BB");
    gradient.addColorStop(1, "#8B31D8");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = "rgba(255,255,255,0.96)";
    ctx.roundRect(44, 58, width - 88, height - 116, 34);
    ctx.fill();

    ctx.fillStyle = "#4C1182";
    ctx.font = "800 28px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Mesa de Ayuda Avellaneda", width / 2, 128);
    ctx.font = "800 44px Arial";
    ctx.fillText("Reclamo enviado", width / 2, 205);

    ctx.fillStyle = "#6B607D";
    ctx.font = "500 24px Arial";
    ctx.fillText("Tu reclamo fue registrado exitosamente.", width / 2, 255);

    ctx.fillStyle = "#F8F5FF";
    ctx.strokeStyle = "#EDE4FA";
    ctx.lineWidth = 2;
    ctx.roundRect(84, 306, width - 168, 166, 24);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#9333EA";
    ctx.font = "800 18px Arial";
    ctx.fillText("TU NÚMERO DE SEGUIMIENTO", width / 2, 358);
    ctx.fillStyle = "#4C1182";
    ctx.font = "800 42px Arial";
    ctx.fillText(numeroSeguimiento ?? "SIN NÚMERO", width / 2, 420);

    ctx.textAlign = "left";
    ctx.fillStyle = "#9333EA";
    ctx.font = "800 18px Arial";
    ctx.fillText("CATEGORÍA", 106, 548);
    ctx.fillStyle = "#4C1182";
    ctx.font = "800 30px Arial";
    ctx.fillText(`${catLabel} — ${data.subcategoria}`, 106, 595, width - 212);

    ctx.fillStyle = "#6B607D";
    ctx.font = "500 22px Arial";
    ctx.fillText(`Fecha: ${new Date().toLocaleDateString("es-AR")}`, 106, 662);

    ctx.fillStyle = "#4C1182";
    ctx.font = "800 24px Arial";
    ctx.fillText("Conducción Cristian Frattini", 106, 760);
    ctx.fillStyle = "#8a7aa7";
    ctx.font = "500 20px Arial";
    ctx.fillText("La Libertad Avanza Avellaneda", 106, 798);

    const filename = `comprobante-${numeroSeguimiento ?? "reclamo"}.png`;
    canvas.toBlob((blob) => {
      const link = document.createElement("a");
      link.download = filename;
      link.href = blob ? URL.createObjectURL(blob) : canvas.toDataURL("image/png");
      link.click();
      if (blob) URL.revokeObjectURL(link.href);
    }, "image/png");
  };

  const handleSubmit = async () => {
    setSubmitLoading(true);
    setSubmitError(null);
    setSubmitWarning(null);
    try {
      let foto_base64: string | null = null;
      let foto_mime: string | null = null;
      if (data.foto) {
        const fotoFile = data.foto;
        foto_mime = fotoFile.type;
        foto_base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (loadEvent) => resolve((loadEvent.target?.result as string).split(",")[1]);
          reader.onerror = reject;
          reader.readAsDataURL(fotoFile);
        });
      }
      const response = await fetch("/api/reclamos", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ nombre: data.nombre.trim(), apellido: data.apellido.trim(), dni: data.dni, fecha_nacimiento: data.fechaNacimiento, sexo: data.sexo || null, telefono: data.telefono.trim(), email: data.email.trim() || null, direccion_denunciante: data.direccionDenunciante.trim(), direccion_problema: data.direccionProblema.trim(), entre_calles: data.entreCalles.trim() || null, barrio: data.barrio.trim(), categoria: data.categoria, subcategoria: data.subcategoria, descripcion: data.descripcion.trim(), foto_base64, foto_mime }) });
      const json = await response.json();
      if (!response.ok) { setSubmitError(json.error ?? "Error al enviar el reclamo. Intentá de nuevo."); return; }
      if (json.googleSheets && !json.googleSheets.ok) setSubmitWarning(json.googleSheets.message ?? "El reclamo se guardó, pero no se pudo sincronizar con Google Sheets.");
      setNumeroSeguimiento(json.numero_seguimiento);
      setSubmitted(true);
    } catch {
      setSubmitError("Error de conexión. Verificá tu internet e intentá de nuevo.");
    } finally {
      setSubmitLoading(false);
    }
  };

  if (submitted) {
    return <Overlay onClose={onClose}><div className="flex-1 overflow-y-auto"><div className="flex flex-col items-center gap-4 px-6 py-6 text-center"><div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-3xl">✅</div><div><h3 className="text-2xl font-extrabold text-[#4C1182]">¡Reclamo enviado!</h3><p className="mt-1.5 max-w-xs text-sm leading-relaxed text-gray-500">Tu reclamo fue registrado exitosamente. Guardá tu número para hacer seguimiento.</p></div>{numeroSeguimiento && <div className="w-full rounded-2xl border border-[#EDE4FA] bg-[#F8F5FF] px-5 py-4 text-center"><p className="mb-2 text-[0.65rem] font-bold uppercase tracking-widest text-[#9333EA]">Tu número de seguimiento</p><p className="font-mono text-2xl font-extrabold tracking-wider text-[#4C1182]">{numeroSeguimiento}</p><p className="mt-1.5 text-xs text-gray-400">Podés consultar el estado de tu reclamo en cualquier momento</p></div>}{submitWarning && <div className="w-full rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-left"><p className="text-xs font-bold uppercase tracking-widest text-amber-700">Atención</p><p className="mt-1 text-sm leading-relaxed text-amber-800">{submitWarning}</p></div>}<div className="w-full rounded-2xl bg-gray-50 px-5 py-3 text-left"><p className="mb-1 text-xs font-bold uppercase tracking-widest text-[#9333EA]">Categoría</p><p className="font-bold text-[#4C1182]">{catIcon} {catLabel} — {data.subcategoria}</p></div></div></div><div className="flex flex-col gap-2 border-t border-gray-100 px-6 py-4"><button onClick={handleGuardarComprobante} className="flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-sm font-bold text-white shadow-md" style={{ background: "linear-gradient(135deg, #4C1182 0%, #9333EA 100%)" }}>⬇️ Guardar comprobante</button><button onClick={onClose} className="w-full rounded-2xl border border-gray-200 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50">Cerrar</button></div></Overlay>;
  }

  return <Overlay onClose={onClose}><div className="flex items-center justify-between border-b border-gray-100 px-6 py-4"><div><h2 className="text-base font-extrabold text-[#4C1182]">{catIcon} {catLabel}</h2><p className="mt-0.5 text-[0.7rem] text-gray-400">Paso {step} de {TOTAL_STEPS}</p></div><div className="flex items-center gap-4"><StepBar current={step} /><button onClick={onClose} className="ml-2 flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600" aria-label="Cerrar"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" /></svg></button></div></div><div className="flex-1 overflow-y-auto px-6 py-6">{step === 1 && <div className="flex flex-col items-center gap-6 py-4 text-center"><div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-[#F3EEFF] text-4xl shadow-sm">{catIcon}</div><div><h3 className="text-2xl font-extrabold text-[#4C1182]">{catLabel}</h3><p className="mt-2 max-w-xs text-sm leading-relaxed text-gray-500">{categoryDescription}</p></div><div className="w-full rounded-2xl border border-[#EDE4FA] bg-[#F8F5FF] px-5 py-4 text-left"><p className="mb-1 text-[0.65rem] font-bold uppercase tracking-widest text-[#9333EA]">Categoría seleccionada</p><p className="text-base font-bold text-[#4C1182]">{catIcon} {catLabel}</p></div></div>}{step === 2 && <div className="flex flex-col gap-5"><div><h3 className="text-xl font-extrabold text-[#4C1182]">¿Cuál es el problema?</h3><p className="mt-1 text-sm text-gray-400">Seleccioná el tipo de problema</p></div><div className="grid grid-cols-2 gap-3">{subcats.map((sub) => <button key={sub} onClick={() => update("subcategoria", sub)} className={`rounded-2xl p-4 text-left text-sm font-semibold transition-all duration-200 ${data.subcategoria === sub ? "scale-[1.02] bg-[#4C1182] text-white shadow-lg shadow-[#4C1182]/20" : "border border-gray-100 bg-gray-50 text-gray-700 hover:border-[#DDD0F5] hover:bg-[#F3EEFF] hover:text-[#4C1182]"}`}>{sub}</button>)}</div>{errors.subcategoria && <p className="flex items-center gap-1.5 text-sm font-medium text-red-500"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" /></svg>{errors.subcategoria}</p>}{isVeredasSelected && <VeredasInfoCard />}</div>}{step === 3 && <div className="flex flex-col gap-4"><div><h3 className="text-xl font-extrabold text-[#4C1182]">Tus datos y ubicación</h3><p className="mt-1 text-sm text-gray-400">Los campos con * son obligatorios</p></div>{isVeredasSelected && <VeredasInfoCard />}<Field label="Nombre *" error={errors.nombre}><input type="text" placeholder="Juan" value={data.nombre} onChange={(event) => update("nombre", event.target.value)} className={inputCls(Boolean(errors.nombre))} /></Field><Field label="Apellido *" error={errors.apellido}><input type="text" placeholder="Pérez" value={data.apellido} onChange={(event) => update("apellido", event.target.value)} className={inputCls(Boolean(errors.apellido))} /></Field><Field label="DNI *" error={errors.dni}><input type="text" placeholder="12345678" value={data.dni} maxLength={9} onChange={(event) => update("dni", event.target.value.replace(/\D/g, ""))} className={inputCls(Boolean(errors.dni))} /></Field><div className="grid grid-cols-1 gap-4 md:grid-cols-2"><Field label="Fecha de nacimiento *" error={errors.fechaNacimiento}><input type="date" value={data.fechaNacimiento} max={todayDate} onChange={(event) => update("fechaNacimiento", event.target.value)} className={inputCls(Boolean(errors.fechaNacimiento))} /></Field><Field label="Sexo"><select value={data.sexo} onChange={(event) => update("sexo", event.target.value)} className={inputCls(false)}><option value="">Prefiero no especificar</option><option value="femenino">Femenino</option><option value="masculino">Masculino</option><option value="otro">Otro</option></select></Field></div><Field label="Teléfono *" error={errors.telefono}><div className="relative"><span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 select-none text-sm text-gray-400">🇦🇷</span><input type="tel" placeholder="1123456789" value={data.telefono} maxLength={15} onChange={(event) => update("telefono", event.target.value.replace(/[^\d\s-]/g, ""))} className={`${inputCls(Boolean(errors.telefono))} pl-10`} /></div><p className="text-[0.65rem] text-gray-300">Se usará para contactarte por WhatsApp</p></Field><Field label="Email" error={errors.email}><input type="email" placeholder="ejemplo@correo.com" value={data.email} onChange={(event) => update("email", event.target.value)} className={inputCls(Boolean(errors.email))} /></Field><Field label="Dirección del denunciante *" error={errors.direccionDenunciante}><input type="text" placeholder="Av. Mitre 1234" value={data.direccionDenunciante} onChange={(event) => update("direccionDenunciante", event.target.value)} className={inputCls(Boolean(errors.direccionDenunciante))} /></Field><Field label="Dirección del problema *" error={errors.direccionProblema}><input type="text" placeholder="Ej: esquina o frente donde está el reclamo" value={data.direccionProblema} onChange={(event) => update("direccionProblema", event.target.value)} className={inputCls(Boolean(errors.direccionProblema))} /></Field><Field label="Entre calles"><input type="text" placeholder="Ej: San Martín y Belgrano" value={data.entreCalles} onChange={(event) => update("entreCalles", event.target.value)} className={inputCls(false)} /></Field><Field label="Barrio *" error={errors.barrio}><input type="text" placeholder="Nombre del barrio" value={data.barrio} onChange={(event) => update("barrio", event.target.value)} className={inputCls(Boolean(errors.barrio))} /></Field><Field label="Descripción del problema *" error={errors.descripcion}><textarea placeholder="Describí detalladamente el problema que encontraste..." value={data.descripcion} rows={4} onChange={(event) => update("descripcion", event.target.value)} className={`${inputCls(Boolean(errors.descripcion))} resize-none leading-relaxed`} /><p className="text-right text-[0.65rem] text-gray-300">{data.descripcion.length}/20 mínimo</p></Field></div>}{step === 4 && <div className="flex flex-col gap-5"><div><h3 className="text-xl font-extrabold text-[#4C1182]">Foto del problema</h3><p className="mt-1 text-sm text-gray-400">Opcional pero muy útil para gestionar tu reclamo</p></div>{fotoPreview ? <div className="relative overflow-hidden rounded-2xl"><img src={fotoPreview} alt="Preview" className="max-h-64 w-full rounded-2xl object-cover" /><button onClick={() => { update("foto", null); setFotoPreview(null); }} className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md transition-transform hover:scale-110" aria-label="Eliminar foto"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4C1182" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg></button></div> : fotoModerating ? <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-[#DDD0F5] bg-[#FDFAFF] p-10 text-center"><div className="h-10 w-10 animate-spin rounded-full border-4 border-[#9333EA] border-t-transparent" /><p className="text-sm font-medium text-gray-500">Verificando imagen...</p></div> : <button onClick={() => fileInputRef.current?.click()} className="flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-[#DDD0F5] bg-[#FDFAFF] p-10 text-center transition-all duration-200 hover:border-[#9333EA] hover:bg-[#F8F5FF]"><div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EDE4FA]"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#9333EA" strokeWidth="1.8"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" strokeLinecap="round" /><polyline points="17 8 12 3 7 8" strokeLinecap="round" strokeLinejoin="round" /><line x1="12" y1="3" x2="12" y2="15" strokeLinecap="round" /></svg></div><div><p className="text-sm font-bold text-[#4C1182]">Tocá para subir una foto</p><p className="mt-1 text-xs text-gray-400">JPG, PNG o WebP, hasta 10 MB</p></div></button>}<input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleFoto} />{errors.foto && <p className="flex items-center gap-1 text-xs font-medium text-red-500"><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" /></svg>{errors.foto}</p>}</div>}{step === 5 && <div className="flex flex-col gap-5"><div><h3 className="text-xl font-extrabold text-[#4C1182]">Confirmá tu reclamo</h3><p className="mt-1 text-sm text-gray-400">Revisá la información antes de enviar</p></div>{isVeredasSelected && <VeredasInfoCard />}<div className="overflow-hidden rounded-2xl border border-gray-100 bg-gray-50"><ResumenRow label="Categoría" value={`${catIcon} ${catLabel}`} /><ResumenRow label="Subcategoría" value={data.subcategoria} /><ResumenRow label="Nombre" value={`${data.nombre} ${data.apellido}`.trim()} /><ResumenRow label="DNI" value={data.dni} /><ResumenRow label="Nacimiento" value={data.fechaNacimiento} /><ResumenRow label="Sexo" value={data.sexo} /><ResumenRow label="Teléfono" value={data.telefono} /><ResumenRow label="Email" value={data.email} /><ResumenRow label="Denunciante" value={data.direccionDenunciante} /><ResumenRow label="Problema" value={data.direccionProblema} /><ResumenRow label="Entre calles" value={data.entreCalles} /><ResumenRow label="Barrio" value={data.barrio} /><ResumenRow label="Descripción" value={data.descripcion} multiline /></div>{fotoPreview && <div><p className="mb-2 text-[0.65rem] font-bold uppercase tracking-widest text-gray-400">Foto adjunta</p><img src={fotoPreview} alt="Foto del reclamo" className="max-h-44 w-full rounded-2xl object-cover" /></div>}</div>}</div><div className="flex flex-col gap-2 border-t border-gray-100 px-6 py-4">{submitError && <p className="rounded-xl bg-red-50 px-3 py-2.5 text-center text-xs font-medium text-red-600">{submitError}</p>}<div className="flex gap-3">{step > 1 && <button onClick={back} disabled={submitLoading} className="flex-1 rounded-2xl border border-gray-200 py-3.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-50">Volver</button>}{step < TOTAL_STEPS ? <button onClick={next} disabled={fotoModerating} className="flex-1 rounded-2xl py-3.5 text-sm font-bold text-white shadow-md transition-all duration-200 hover:opacity-90 active:scale-[0.98] disabled:opacity-60" style={{ background: "linear-gradient(135deg, #4C1182 0%, #9333EA 100%)" }}>Continuar →</button> : <button onClick={handleSubmit} disabled={submitLoading} className="flex-1 rounded-2xl py-3.5 text-sm font-bold text-white shadow-md transition-all duration-200 hover:opacity-90 active:scale-[0.98] disabled:opacity-60" style={{ background: "linear-gradient(135deg, #4C1182 0%, #9333EA 100%)" }}>{submitLoading ? "Enviando..." : "Enviar Reclamo"}</button>}</div></div></Overlay>;
}

function Overlay({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm sm:items-center" onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}><div className="relative flex w-full max-w-lg flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl" style={{ maxHeight: "92vh" }}>{children}</div></div>;
}
