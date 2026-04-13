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
      {/* ── HEADER ── */}
      <header
        className="px-6 pt-6 pb-10 md:px-12 md:pt-8 md:pb-14"
        style={{ backgroundColor: "#32105B" }}
      >
        {/* fila superior: logo + botones */}
        <div className="flex items-start justify-between">
          <LogoLLA />
          <div className="flex items-center gap-2 mt-2">
            <Link
              href="/consulta"
              className="text-white font-medium px-5 py-2.5 rounded-2xl transition-colors text-sm"
              style={{
                backgroundColor: "rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              Consultar
            </Link>

            {/* WhatsApp */}
            <a
              href="https://wa.me/541128365690"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-opacity hover:opacity-80"
              style={{ backgroundColor: "#25D366" }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </a>

            {/* Instagram */}
            <a
              href="https://www.instagram.com/complejo.rey"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-opacity hover:opacity-80"
              style={{
                background: "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* nombre e info debajo del logo */}
        <div className="mt-5">
          <h1 className="text-white font-bold text-xl leading-tight tracking-tight">
            Cristian Frattini
          </h1>
          <p
            className="text-sm font-medium mt-0.5"
            style={{ color: "rgba(255,255,255,0.7)" }}
          >
            Bloque La Libertad Avanza Avellaneda
          </p>
          <p
            className="text-xs mt-0.5"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            Coordinador local
          </p>
        </div>
      </header>

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
