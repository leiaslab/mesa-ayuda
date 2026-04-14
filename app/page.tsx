import Link from "next/link";
import LogoLLA from "@/components/LogoLLA";
import HeroAndCategories from "@/components/HeroAndCategories";

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
        <header className="bg-[#35105f] px-5 pt-5 pb-4 md:px-8 md:pt-6 md:pb-4 lg:px-[72px] lg:pt-5 lg:pb-5">
          <div className="mx-auto flex max-w-[1366px] flex-col gap-0">

            {/* ── MOBILE (oculto en lg) ── */}
            <div className="flex flex-col gap-3 lg:hidden">
              {/* Fila 1: logo + pill */}
              <div className="flex items-center justify-between gap-2">
                <LogoLLA priority className="h-auto w-[110px]" />
                <span
                  className="inline-flex rounded-full px-4 py-2 text-[0.65rem] font-bold uppercase tracking-[0.08em] text-white"
                  style={{
                    backgroundColor: "rgba(120,50,200,0.55)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  Mesa de Ayuda Virtual
                </span>
              </div>
              {/* Fila 2: identidad */}
              <div>
                <p className="text-[1rem] font-extrabold text-white">Cristian Frattini</p>
                <p className="text-[0.75rem] font-semibold text-white/70">Bloque La Libertad Avanza Avellaneda</p>
                <p className="text-[0.68rem] text-white/45">Coordinador local</p>
              </div>
              {/* Fila 3: redes */}
              <div>
                <p className="mb-2 text-[0.65rem] text-white/55">Seguinos en nuestras redes</p>
                <div className="flex items-center gap-2">
                  <a href="https://www.facebook.com/LaLibertadAvanzaAr" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="flex h-7 w-7 items-center justify-center rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.15)" }}><svg width="13" height="13" viewBox="0 0 24 24" fill="white"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg></a>
                  <a href="https://www.instagram.com/lalibertadavanzaavellaneda/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="flex h-7 w-7 items-center justify-center rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.15)" }}><svg width="13" height="13" viewBox="0 0 24 24" fill="white"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.44 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg></a>
                  <a href="https://www.youtube.com/@LaLibertadAvanzaNacional/videos" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="flex h-7 w-7 items-center justify-center rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.15)" }}><svg width="13" height="13" viewBox="0 0 24 24" fill="white"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg></a>
                  <a href="https://www.tiktok.com/@lalibertadavanzanacional" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="flex h-7 w-7 items-center justify-center rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.15)" }}><svg width="13" height="13" viewBox="0 0 24 24" fill="white"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg></a>
                  <a href="https://x.com/LLibertadAvanza" target="_blank" rel="noopener noreferrer" aria-label="X" className="flex h-7 w-7 items-center justify-center rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.15)" }}><svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></a>
                </div>
              </div>
            </div>

            {/* ── DESKTOP (oculto en mobile) ── */}
            <div className="hidden lg:grid lg:grid-cols-3 lg:items-center lg:gap-4">

              {/* COL 1 — logo + redes sociales */}
              <div className="flex flex-col gap-3">
                <LogoLLA
                  priority
                  className="h-auto w-[130px] md:w-[160px] lg:w-[180px]"
                />
                <div>
                  <p className="mb-2 text-[0.7rem] font-medium text-white/60 lg:text-[0.75rem]">
                    Seguinos en nuestras redes
                  </p>
                  <div className="flex items-center gap-2">
                    {/* Facebook */}
                    <a href="https://www.facebook.com/LaLibertadAvanzaAr" target="_blank" rel="noopener noreferrer" aria-label="Facebook"
                      className="flex h-7 w-7 items-center justify-center rounded-full transition-opacity hover:opacity-80"
                      style={{ backgroundColor: "rgba(255,255,255,0.15)" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                    </a>
                    {/* Instagram */}
                    <a href="https://www.instagram.com/lalibertadavanzaavellaneda/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                      className="flex h-7 w-7 items-center justify-center rounded-full transition-opacity hover:opacity-80"
                      style={{ backgroundColor: "rgba(255,255,255,0.15)" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                    </a>
                    {/* YouTube */}
                    <a href="https://www.youtube.com/@LaLibertadAvanzaNacional/videos" target="_blank" rel="noopener noreferrer" aria-label="YouTube"
                      className="flex h-7 w-7 items-center justify-center rounded-full transition-opacity hover:opacity-80"
                      style={{ backgroundColor: "rgba(255,255,255,0.15)" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                    </a>
                    {/* TikTok */}
                    <a href="https://www.tiktok.com/@lalibertadavanzanacional" target="_blank" rel="noopener noreferrer" aria-label="TikTok"
                      className="flex h-7 w-7 items-center justify-center rounded-full transition-opacity hover:opacity-80"
                      style={{ backgroundColor: "rgba(255,255,255,0.15)" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
                    </a>
                    {/* X */}
                    <a href="https://x.com/LLibertadAvanza" target="_blank" rel="noopener noreferrer" aria-label="X"
                      className="flex h-7 w-7 items-center justify-center rounded-full transition-opacity hover:opacity-80"
                      style={{ backgroundColor: "rgba(255,255,255,0.15)" }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="white"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                    </a>
                  </div>
                </div>
              </div>

              {/* COL 2 — pill centrada */}
              <div className="flex justify-center">
                <span
                  className="inline-flex rounded-full px-6 py-2.5 text-sm font-bold uppercase tracking-[0.1em] text-white lg:px-8 lg:py-3 lg:text-[15px]"
                  style={{
                    backgroundColor: "rgba(120,50,200,0.55)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    boxShadow: "0 0 20px rgba(120,50,200,0.4)",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  Mesa de Ayuda Virtual
                </span>
              </div>

              {/* COL 3 — identidad derecha */}
              <div className="flex flex-col items-end text-right">
                <p className="text-[1.1rem] font-extrabold tracking-[-0.02em] text-white lg:text-[1.2rem]">
                  Cristian Frattini
                </p>
                <p className="mt-0.5 text-[0.78rem] font-semibold text-white/75 lg:text-[0.8rem]">
                  Bloque La Libertad Avanza Avellaneda
                </p>
                <p className="mt-0.5 text-[0.68rem] text-white/45 lg:text-[0.7rem]">
                  Coordinador local
                </p>
              </div>

            </div>{/* fin desktop grid */}

          </div>
        </header>

        <HeroAndCategories />
      </div>

      {/* WhatsApp flotante */}
      <div className="fixed right-4 bottom-6 z-40 md:right-6 md:bottom-8 lg:right-7 lg:bottom-10">
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
          <p className="text-sm leading-relaxed text-white/65">
            Tu reclamo es importante para nosotros.
            <br />
            Lo registramos, lo asignamos y lo resolvemos.
          </p>
        </div>
      </section>

      <footer style={{ backgroundColor: "#32105B" }}>
        {/* Cuerpo del footer */}
        <div className="mx-auto max-w-6xl px-8 py-14 md:px-12 lg:px-16">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">

            {/* Logo */}
            <div className="flex items-start">
              <LogoLLA className="h-auto w-[100px] opacity-80" />
            </div>

            {/* Sobre Nosotros */}
            <div>
              <h3 className="mb-4 text-base font-bold text-white">
                Sobre Nosotros
              </h3>
              <ul className="space-y-3">
                {["Principios", "Galería", "Sumate"].map((item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="text-sm text-white/70 transition-colors hover:text-white"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Información Legal */}
            <div>
              <h3 className="mb-4 text-base font-bold text-white">
                Información Legal
              </h3>
              <ul className="space-y-3">
                {[
                  "Contacto",
                  "Términos de uso",
                  "Política de privacidad",
                  "Botón de arrepentimiento",
                ].map((item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="text-sm text-white/70 transition-colors hover:text-white"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>

        {/* Barra inferior */}
        <div
          className="border-t px-8 py-5 text-center"
          style={{ borderColor: "rgba(255,255,255,0.1)" }}
        >
          <p className="text-sm text-white/60">
            &copy; 2026 La Libertad Avanza. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
