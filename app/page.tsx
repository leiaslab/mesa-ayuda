import LogoLLA from "@/components/LogoLLA";
import HeroAndCategories, { HowItWorksSection } from "@/components/HeroAndCategories";
import SplashScreen from "@/components/SplashScreen";
import { getPublicSiteContent } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export default async function Home() {
  const content = await getPublicSiteContent();
  const mobileRole = content.identity.role.trim() || "Coordinador de La Libertad Avanza Avellaneda";

  return (
    <div className="min-h-screen bg-white font-sans text-[#1f1333]">
      <SplashScreen src={content.splash.imageUrl} />
      <section className="flex min-h-[100svh] flex-col overflow-x-hidden lg:min-h-screen">
        <header className="bg-[#2D0A69] px-4 pb-4 pt-6 md:px-8 md:py-5 lg:px-[72px] lg:py-5">
          <div className="mx-auto max-w-[1366px]">

            {/* Mobile: una sola fila compacta */}
            <div className="flex justify-center lg:hidden">
              <LogoLLA priority className="h-auto w-[210px] md:w-[230px]" />
            </div>

            {/* Desktop: logo + badge centrado */}
            <div className="hidden lg:grid lg:grid-cols-[260px_minmax(0,1fr)_285px] lg:items-start lg:gap-4">
              <div>
                <LogoLLA priority className="h-auto w-[226px]" />
              </div>

              <div className="flex justify-center pt-8">
                <span
                  className="inline-flex rounded-full px-6 py-2 text-[0.74rem] font-semibold uppercase tracking-[0.18em] text-white/90"
                  style={{
                    backgroundColor: "rgba(120, 50, 200, 0.46)",
                    border: "1px solid rgba(255,255,255,0.16)",
                    boxShadow: "0 0 26px rgba(120, 50, 200, 0.25)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  {content.hero.eyebrow}
                </span>
              </div>

              <div aria-hidden="true" />
            </div>

          </div>
        </header>

        <HeroAndCategories
          hero={content.hero}
          identity={{
            name: content.identity.name,
            role: mobileRole,
          }}
        />
      </section>

      <HowItWorksSection howItWorks={content.howItWorks} />

      <div className="pointer-events-none fixed bottom-5 right-5 z-50 md:bottom-6 md:right-6">
        <a
          href={content.hero.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Escribinos por WhatsApp"
          className="pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-[0_14px_32px_rgba(14,35,19,0.28)] transition-transform duration-200 hover:scale-105 active:scale-95 motion-safe:animate-[softPulse_3.2s_ease-in-out_infinite]"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              fill="white"
              d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
            />
          </svg>
        </a>
      </div>

      <section
        className="px-5 py-14 md:px-8 lg:px-[72px] lg:py-16"
        style={{
          background: "linear-gradient(145deg, #2D0A69 0%, #8B31D8 100%)",
        }}
      >
        <div className="mx-auto max-w-[920px] text-center text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/70">
            Mesa de ayuda
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-[-0.03em] md:text-4xl">
            Tu reclamo importa
          </h2>
          <p className="mx-auto mt-4 max-w-[640px] text-base leading-7 text-white/72">
            Registramos cada caso, le damos seguimiento y te acompañamos para que
            puedas consultar el estado en cualquier momento.
          </p>
        </div>
      </section>

      <footer className="bg-[#2D0A69] text-white">
        <div className="mx-auto max-w-[1366px] px-5 py-12 md:px-8 lg:px-[72px] lg:py-14">
          <div className="grid gap-10 border-b border-white/10 pb-10 md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] md:gap-8">
            <div className="flex flex-col gap-6">
              <LogoLLA className="h-auto w-[120px] opacity-90 md:w-[132px]" />
              <div>
                <p className="text-lg font-semibold">
                  {content.footer.institutionName}
                </p>
                <p className="mt-2 text-sm text-white/65">
                  {content.footer.socialPrompt}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {content.footer.socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/10 transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/16"
                  >
                    <SocialIcon type={social.icon as SocialIconType} />
                  </a>
                ))}
              </div>
            </div>

            <div id="footer-legal" className="flex flex-col gap-3 md:items-end md:text-right">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
                Legales
              </p>
              <div className="flex flex-col gap-2 text-sm text-white/55 md:items-end">
                {content.footer.legalLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                    rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="transition-colors hover:text-white"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-5">
            <p className="text-sm text-white/45">
              © 2026 La Libertad Avanza Avellaneda. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

type SocialIconType = "instagram" | "facebook" | "youtube" | "tiktok" | "x";

function SocialIcon({ type }: { type: SocialIconType }) {
  switch (type) {
    case "instagram":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            fill="white"
            d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069Zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98C0 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0Zm0 5.838A6.162 6.162 0 1 0 12 18a6.162 6.162 0 0 0 0-12.324Zm0 10.162A4 4 0 1 1 12 8a4 4 0 0 1 0 8Zm6.406-11.845a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88Z"
          />
        </svg>
      );
    case "facebook":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            fill="white"
            d="M24 12.073C24 5.446 18.627.073 12 .073S0 5.446 0 12.073c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073Z"
          />
        </svg>
      );
    case "youtube":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            fill="white"
            d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814ZM9.545 15.568V8.432L15.818 12l-6.273 3.568Z"
          />
        </svg>
      );
    case "tiktok":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            fill="white"
            d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07Z"
          />
        </svg>
      );
    case "x":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            fill="white"
            d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z"
          />
        </svg>
      );
  }
}
