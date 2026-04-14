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
      <div className="flex min-h-svh flex-col">
        <header className="bg-[#35105f] px-5 pt-5 pb-3 md:px-8 md:pt-6 md:pb-3 lg:px-[72px] lg:pt-[18px] lg:pb-[6px]">
          <div className="mx-auto flex max-w-[1366px] flex-col gap-3">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="max-w-xl">
                <LogoLLA
                  priority
                  className="h-auto w-[170px] md:w-[198px] lg:w-[202px]"
                />

                <div className="mt-4 pl-3 md:mt-4 md:pl-4 lg:mt-[18px] lg:pl-[16px]">
                  <p className="text-[1.34rem] font-extrabold tracking-[-0.03em] text-white md:text-[1.45rem] lg:text-[1.4rem]">
                    Cristian Frattini
                  </p>
                  <p className="mt-1 text-[0.8rem] font-semibold text-white/84 md:text-[0.82rem] lg:text-[0.74rem]">
                    Bloque La Libertad Avanza Avellaneda
                  </p>
                  <p className="mt-0.5 text-[0.7rem] text-white/45 md:text-[0.72rem] lg:text-[0.64rem]">
                    Coordinador local
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-start gap-2 self-start md:items-end lg:mt-[6px] lg:min-w-[320px]">
              </div>
            </div>

            <div className="flex justify-center lg:-mt-10">
              <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-7 py-3 text-sm font-semibold capitalize tracking-[0.02em] text-white/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-sm md:px-8 md:py-3.5 md:text-base lg:px-10 lg:py-4 lg:text-lg">
                Mesa de Ayuda Virtual
              </span>
            </div>
          </div>
        </header>

        <section
          className="flex flex-1 items-center justify-center overflow-hidden px-5 pb-8 text-center md:px-8 md:pb-8 lg:px-[72px]"
          style={{
            background:
              "radial-gradient(circle at 84% 76%, rgba(130, 34, 233, 0.55) 0%, rgba(130, 34, 233, 0) 26%), linear-gradient(180deg, #43146f 0%, #4c1781 48%, #5614a1 100%)",
          }}
        >
          <div className="mx-auto w-full max-w-[1366px]">
            <h1 className="mx-auto mt-0 max-w-4xl text-balance text-4xl font-extrabold leading-[1.04] tracking-[-0.04em] text-white md:mt-1 md:text-5xl lg:mt-0 lg:max-w-[700px] lg:text-[46px]">
              Reportá un problema en tu barrio
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-white/55 md:text-xl lg:mt-[10px] lg:max-w-[760px] lg:text-[17px] lg:leading-[1.38]">
              Hacé tu reclamo vecinal en minutos y seguí su estado en tiempo real.
            </p>

            <div className="mx-auto mt-4 flex max-w-md flex-col gap-3 md:mt-5 lg:mt-[18px]">
              <Link
                href="/reclamo"
                className="flex w-full items-center justify-center gap-2.5 rounded-2xl bg-white py-3 text-base font-bold text-[#32105B] shadow-xl transition-transform active:scale-95 lg:py-[16px]"
              >
                <span className="text-lg">📝</span>
                Hacer un Reclamo
              </Link>
              <Link
                href="/consulta"
                className="flex w-full items-center justify-center gap-2.5 rounded-2xl border border-white/20 bg-white/10 py-3 text-base font-semibold text-white transition-transform active:scale-95 lg:py-[16px]"
              >
                <span className="text-lg">🔍</span>
                Consultar Estado
              </Link>
            </div>
          </div>
        </section>
      </div>

      <div className="fixed right-4 bottom-6 z-40 flex flex-col gap-4 md:right-6 md:bottom-8 lg:right-[28px] lg:top-[52%] lg:bottom-auto lg:-translate-y-1/2">
        <a
          href="https://www.instagram.com/complejo.rey"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Seguinos en Instagram"
          className="flex h-14 w-14 items-center justify-center rounded-full shadow-[0_16px_32px_rgba(40,0,80,0.32)] transition-transform hover:scale-105 lg:h-[56px] lg:w-[56px]"
          style={{
            background:
              "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
        </a>

        <a
          href="https://wa.me/541128365690"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Escribinos por WhatsApp"
          className="flex h-14 w-14 items-center justify-center rounded-full shadow-[0_16px_32px_rgba(40,0,80,0.32)] transition-transform hover:scale-105 lg:h-[56px] lg:w-[56px]"
          style={{ backgroundColor: "#25D366" }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </a>
      </div>


      <section className="bg-gray-50 px-4 py-10">
        <div className="mx-auto max-w-md">
          <h2 className="mb-1 text-xl font-bold text-[#32105B]">
            ¿Qué necesitás reportar?
          </h2>
          <p className="mb-6 text-sm text-gray-400">
            Seleccioná la categoría de tu reclamo
          </p>

          <div className="grid grid-cols-2 gap-3">
            {categories.map((cat) => (
              <Link
                key={cat.label}
                href={cat.href}
                className={`rounded-2xl bg-white p-4 shadow-sm transition-all hover:shadow-md active:scale-95 ${
                  cat.wide ? "col-span-2 flex flex-row items-center gap-3" : "flex flex-col gap-3"
                }`}
                style={{
                  border: "1px solid #F0EBF8",
                }}
              >
                <span className="text-3xl">{cat.icon}</span>
                <div>
                  <p className="text-sm font-semibold leading-tight text-[#32105B]">
                    {cat.label}
                  </p>
                  <p className="mt-0.5 text-xs leading-snug text-gray-400">
                    {cat.desc}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-10">
        <div className="mx-auto max-w-md">
          <h2 className="mb-1 text-xl font-bold text-[#32105B]">
            ¿Cómo funciona?
          </h2>
          <p className="mb-8 text-sm text-gray-400">Tres pasos simples</p>

          <div className="flex flex-col gap-6">
            {steps.map((step, index) => (
              <div key={step.num} className="relative flex items-start gap-4">
                <div
                  className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl text-sm font-bold text-white shadow-md"
                  style={{
                    background:
                      "linear-gradient(135deg, #32105B 0%, #6011E8 100%)",
                  }}
                >
                  {step.num}
                </div>
                <div className="flex-1 pt-1">
                  <p className="text-sm font-semibold leading-tight text-[#32105B]">
                    {step.title}
                  </p>
                  <p className="mt-1.5 text-xs leading-relaxed text-gray-400">
                    {step.desc}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className="absolute top-14 left-[1.4rem] h-6 w-0.5 rounded-full"
                    style={{ backgroundColor: "#EDE9F8" }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="px-4 py-12"
        style={{
          background: "linear-gradient(145deg, #32105B 0%, #6011E8 100%)",
        }}
      >
        <div className="mx-auto max-w-md text-center">
          <h2 className="mb-2 text-xl font-bold leading-tight text-white">
            ¿Tenés un problema en tu barrio?
          </h2>
          <p className="mb-8 text-sm leading-relaxed text-white/65">
            Tu reclamo es importante para nosotros.
            <br />
            Lo registramos, lo asignamos y lo resolvemos.
          </p>
          <Link
            href="/reclamo"
            className="flex w-full items-center justify-center gap-2.5 rounded-2xl bg-white px-8 py-4 text-base font-bold text-[#32105B] shadow-xl transition-all active:scale-95"
          >
            <span className="text-lg">📝</span>
            Hacer mi Reclamo
          </Link>
        </div>
      </section>

      <footer className="bg-[#1A0830] px-4 py-8 text-center">
        <div className="mx-auto max-w-md">
          <p className="text-sm font-semibold text-white">
            Bloque La Libertad Avanza Avellaneda
          </p>
          <p className="mt-1 text-xs text-white/35">
            Mesa de Ayuda Vecinal &copy; 2026
          </p>
          <div className="mt-5 flex items-center justify-center gap-4">
            <Link href="/consulta" className="text-xs text-white/40 transition-colors">
              Consultar Reclamo
            </Link>
            <span className="text-white/20">·</span>
            <Link href="/admin" className="text-xs text-white/40 transition-colors">
              Panel Admin
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
