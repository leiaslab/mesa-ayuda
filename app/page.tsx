import Link from "next/link";
import LogoLLA from "@/components/LogoLLA";

const categories = [
  {
    icon: "🛣️",
    label: "Calles",
    desc: "Baches, cordones, veredas",
    href: "/reclamo?cat=calles",
  },
  {
    icon: "💡",
    label: "Alumbrado",
    desc: "Postes y luminarias",
    href: "/reclamo?cat=alumbrado",
  },
  {
    icon: "💧",
    label: "Aguas",
    desc: "Pérdidas y cloacas",
    href: "/reclamo?cat=aguas",
  },
  {
    icon: "🗑️",
    label: "Basura",
    desc: "Recolección y contenedores",
    href: "/reclamo?cat=basura",
  },
  {
    icon: "🌊",
    label: "Inundación",
    desc: "Anegamientos y desagüe",
    href: "/reclamo?cat=inundacion",
  },
  {
    icon: "🔒",
    label: "Inseguridad",
    desc: "Iluminación y espacios",
    href: "/reclamo?cat=inseguridad",
  },
  {
    icon: "📋",
    label: "Otros",
    desc: "Otros reclamos vecinales",
    href: "/reclamo?cat=otros",
    wide: true,
  },
];

const steps = [
  {
    num: "01",
    title: "Completá el formulario",
    desc: "Ingresá tus datos, describí el problema y adjuntá fotos si tenés.",
  },
  {
    num: "02",
    title: "Recibís tu número",
    desc: "Se genera tu código único: AVA-00001-2026. Guardalo para hacer seguimiento.",
  },
  {
    num: "03",
    title: "Seguí el estado",
    desc: "Consultá el avance de tu reclamo en cualquier momento, desde cualquier dispositivo.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* ── NAVBAR ── */}
      <nav
        className="sticky top-0 z-50 px-4 py-4 flex items-center justify-between shadow-lg"
        style={{ backgroundColor: "#32105B" }}
      >
        <div className="flex items-center gap-4 min-w-0">
          <LogoLLA />
          <div className="min-w-0">
            <p className="text-white font-extrabold text-xl leading-tight tracking-tight">
              Cristian Frattini
            </p>
            <p
              className="text-sm leading-snug font-semibold mt-0.5"
              style={{ color: "rgba(255,255,255,0.75)" }}
            >
              Bloque La Libertad Avanza Avellaneda
            </p>
            <p
              className="text-xs leading-tight mt-0.5"
              style={{ color: "rgba(255,255,255,0.45)" }}
            >
              Coordinador local
            </p>
          </div>
        </div>
        <Link
          href="/consulta"
          className="text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors flex-shrink-0 ml-3"
          style={{
            backgroundColor: "rgba(255,255,255,0.12)",
            border: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          Consultar
        </Link>
      </nav>

      {/* ── HERO ── */}
      <section
        className="px-4 pt-14 pb-10 text-center"
        style={{
          background:
            "linear-gradient(145deg, #32105B 0%, #4A0F8A 50%, #6011E8 100%)",
        }}
      >
        <div className="max-w-md mx-auto">
          <span
            className="inline-block text-xs font-semibold px-4 py-1.5 rounded-full mb-6 tracking-wide uppercase"
            style={{
              backgroundColor: "rgba(255,255,255,0.12)",
              color: "rgba(255,255,255,0.75)",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            Mesa de Ayuda Virtual
          </span>

          <h1 className="text-white text-[2rem] font-bold leading-tight mb-4">
            Reportá un problema en tu barrio
          </h1>
          <p
            className="text-base leading-relaxed mb-10"
            style={{ color: "rgba(255,255,255,0.65)" }}
          >
            Hacé tu reclamo vecinal en minutos y seguí su estado en tiempo
            real.
          </p>

          <div className="flex flex-col gap-3">
            <Link
              href="/reclamo"
              className="w-full font-bold text-base py-4 rounded-2xl flex items-center justify-center gap-2.5 shadow-xl transition-all active:scale-95"
              style={{ backgroundColor: "#fff", color: "#32105B" }}
            >
              <span className="text-lg">📝</span>
              Hacer un Reclamo
            </Link>
            <Link
              href="/consulta"
              className="w-full font-semibold text-base py-4 rounded-2xl flex items-center justify-center gap-2.5 transition-all active:scale-95"
              style={{
                backgroundColor: "rgba(255,255,255,0.1)",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.25)",
              }}
            >
              <span className="text-lg">🔍</span>
              Consultar Estado
            </Link>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section
        className="px-4 pb-8"
        style={{ backgroundColor: "#2A0D4E" }}
      >
        <div className="max-w-md mx-auto grid grid-cols-3 gap-2 pt-0">
          {[
            { val: "+2.400", label: "Reclamos" },
            { val: "94%", label: "Resueltos" },
            { val: "48hs", label: "Respuesta" },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-2xl px-2 py-4 text-center"
              style={{
                backgroundColor: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <p className="text-white font-bold text-xl leading-none">
                {s.val}
              </p>
              <p
                className="text-xs mt-1.5"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CATEGORÍAS ── */}
      <section className="px-4 py-10 bg-gray-50">
        <div className="max-w-md mx-auto">
          <h2
            className="text-xl font-bold mb-1"
            style={{ color: "#32105B" }}
          >
            ¿Qué necesitás reportar?
          </h2>
          <p className="text-gray-400 text-sm mb-6">
            Seleccioná la categoría de tu reclamo
          </p>

          <div className="grid grid-cols-2 gap-3">
            {categories.map((cat) => (
              <Link
                key={cat.label}
                href={cat.href}
                className={`bg-white rounded-2xl p-4 flex flex-col gap-3 shadow-sm transition-all active:scale-95 hover:shadow-md${
                  cat.wide ? " col-span-2 flex-row items-center" : ""
                }`}
                style={{
                  border: "1px solid #F0EBF8",
                }}
              >
                <span className={cat.wide ? "text-3xl" : "text-3xl"}>
                  {cat.icon}
                </span>
                <div>
                  <p
                    className="font-semibold text-sm leading-tight"
                    style={{ color: "#32105B" }}
                  >
                    {cat.label}
                  </p>
                  <p className="text-gray-400 text-xs mt-0.5 leading-snug">
                    {cat.desc}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CÓMO FUNCIONA ── */}
      <section className="px-4 py-10 bg-white">
        <div className="max-w-md mx-auto">
          <h2
            className="text-xl font-bold mb-1"
            style={{ color: "#32105B" }}
          >
            ¿Cómo funciona?
          </h2>
          <p className="text-gray-400 text-sm mb-8">Tres pasos simples</p>

          <div className="flex flex-col gap-6">
            {steps.map((step, i) => (
              <div key={step.num} className="flex gap-4 items-start">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-md"
                  style={{
                    background:
                      "linear-gradient(135deg, #32105B 0%, #6011E8 100%)",
                  }}
                >
                  {step.num}
                </div>
                <div className="pt-1 flex-1">
                  <p
                    className="font-semibold text-sm leading-tight"
                    style={{ color: "#32105B" }}
                  >
                    {step.title}
                  </p>
                  <p className="text-gray-400 text-xs mt-1.5 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
                {i < steps.length - 1 && (
                  <div
                    className="absolute left-[1.75rem] mt-14 w-0.5 h-6 rounded-full"
                    style={{ backgroundColor: "#EDE9F8" }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA INFERIOR ── */}
      <section
        className="px-4 py-12"
        style={{
          background:
            "linear-gradient(145deg, #32105B 0%, #6011E8 100%)",
        }}
      >
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-white text-xl font-bold mb-2 leading-tight">
            ¿Tenés un problema en tu barrio?
          </h2>
          <p
            className="text-sm mb-8 leading-relaxed"
            style={{ color: "rgba(255,255,255,0.65)" }}
          >
            Tu reclamo es importante para nosotros.
            <br />
            Lo registramos, lo asignamos y lo resolvemos.
          </p>
          <Link
            href="/reclamo"
            className="flex items-center justify-center gap-2.5 font-bold text-base py-4 px-8 rounded-2xl shadow-xl transition-all active:scale-95 w-full"
            style={{ backgroundColor: "#fff", color: "#32105B" }}
          >
            <span className="text-lg">📝</span>
            Hacer mi Reclamo
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer
        className="px-4 py-8 text-center"
        style={{ backgroundColor: "#1A0830" }}
      >
        <div className="max-w-md mx-auto">
          <p className="text-white font-semibold text-sm">
            Bloque La Libertad Avanza Avellaneda
          </p>
          <p
            className="text-xs mt-1"
            style={{ color: "rgba(255,255,255,0.35)" }}
          >
            Mesa de Ayuda Vecinal &copy; 2026
          </p>
          <div className="flex items-center justify-center gap-4 mt-5">
            <Link
              href="/consulta"
              className="text-xs transition-colors"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              Consultar Reclamo
            </Link>
            <span style={{ color: "rgba(255,255,255,0.2)" }}>·</span>
            <Link
              href="/admin"
              className="text-xs transition-colors"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              Panel Admin
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
