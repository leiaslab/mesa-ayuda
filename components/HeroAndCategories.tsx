"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import CategoriasSection from "./CategoriasSection";
import type { SiteContentBundle } from "@/lib/site-content";

type Props = {
  hero: SiteContentBundle["hero"];
  identity: {
    name: string;
    role: string;
  };
};

function PencilIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 20h9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle
        cx="11"
        cy="11"
        r="7"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="m20 20-3.5-3.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IdentityPanel({
  name,
  role,
  compact = false,
}: {
  name: string;
  role: string;
  compact?: boolean;
}) {
  return (
    <div
      className={`rounded-[28px] border border-white/16 bg-white/10 text-white shadow-[0_18px_42px_rgba(20,5,40,0.18)] backdrop-blur-sm ${
        compact ? "w-full max-w-[340px] px-5 py-4" : "mx-auto mt-7 max-w-[560px] px-7 py-5"
      }`}
    >
      <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-white/65">
        Conducción
      </p>
      <p
        className={`mt-2 font-extrabold tracking-[-0.05em] text-white ${
          compact ? "text-[2rem] leading-[0.95]" : "text-[3rem] leading-[0.92]"
        }`}
      >
        {name}
      </p>
      <p className={`mt-2 font-semibold text-white/76 ${compact ? "text-[0.95rem]" : "text-[1rem]"}`}>
        {role}
      </p>
    </div>
  );
}

export default function HeroAndCategories({ hero, identity }: Props) {
  const [showCategories, setShowCategories] = useState(false);
  const categoriesRef = useRef<HTMLDivElement>(null);

  const handleHacerReclamo = () => {
    if (showCategories) {
      categoriesRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    setShowCategories(true);

    window.setTimeout(() => {
      categoriesRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  };

  return (
    <>
      <section
        className="flex flex-1 flex-col text-center"
        style={{
          background:
            "radial-gradient(circle at 82% 78%, rgba(147, 51, 234, 0.52) 0%, rgba(147, 51, 234, 0) 28%), linear-gradient(180deg, #2D0A69 0%, #5B17BB 52%, #8B31D8 100%)",
        }}
      >
        <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-8 px-5 pb-10 pt-4 lg:hidden">
          <span
            className="inline-flex rounded-full px-5 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-white/90"
            style={{
              backgroundColor: "rgba(120, 50, 200, 0.46)",
              border: "1px solid rgba(255,255,255,0.22)",
              boxShadow: "0 0 24px rgba(120, 50, 200, 0.22)",
              backdropFilter: "blur(10px)",
            }}
          >
            {hero.eyebrow}
          </span>

          <div className="flex max-w-[360px] flex-col items-center gap-5">
            <div className="space-y-3">
              <p className="text-[3.6rem] font-extrabold leading-[0.9] tracking-[-0.06em] text-white">
                {hero.city}
              </p>
              <h1 className="text-balance text-[1.75rem] font-extrabold leading-[1.1] tracking-[-0.03em] text-white">
                {hero.title}
              </h1>
            </div>
            <p className="max-w-[320px] text-pretty text-[1rem] leading-[1.6] text-white/74">
              {hero.description}
            </p>
          </div>

          <IdentityPanel name={identity.name} role={identity.role} compact />

          <div className="flex w-full max-w-[340px] flex-col gap-4">
            <button
              type="button"
              onClick={handleHacerReclamo}
              className="flex min-h-[56px] w-full items-center justify-center gap-2.5 rounded-full bg-white px-6 py-3 text-[1rem] font-bold leading-none text-[#4C1182] shadow-[0_18px_38px_rgba(29,10,54,0.28)] active:scale-[0.98]"
            >
              <span className="inline-flex shrink-0 items-center justify-center text-[#8B31D8]">
                <PencilIcon />
              </span>
              <span>{hero.primaryCta}</span>
            </button>
            <Link
              href="/consulta"
              className="flex min-h-[56px] w-full items-center justify-center gap-2.5 rounded-full border border-white/20 bg-white/12 px-6 py-3 text-[1rem] font-semibold leading-none text-white shadow-[0_12px_28px_rgba(23,8,42,0.14)] active:scale-[0.98]"
            >
              <span className="inline-flex shrink-0 items-center justify-center text-white/80">
                <SearchIcon />
              </span>
              <span>{hero.secondaryCta}</span>
            </Link>
          </div>
        </div>

        <div className="mx-auto hidden w-full max-w-[1366px] flex-1 items-center justify-center px-[72px] pb-[6rem] pt-1 lg:flex">
          <div className="w-full max-w-[920px]">
            <p className="text-[4.55rem] font-extrabold tracking-[-0.06em] text-white">
              {hero.city}
            </p>
            <h1 className="mx-auto mt-3 max-w-[760px] text-balance text-[3.15rem] font-extrabold leading-[1.05] tracking-[-0.05em] text-white">
              {hero.title}
            </h1>
            <p className="mx-auto mt-3.5 max-w-[700px] text-pretty text-[1rem] leading-[1.45] text-[#cdbfe1]">
              {hero.description}
            </p>

            <IdentityPanel name={identity.name} role={identity.role} />

            <div className="mx-auto mt-6 flex w-full max-w-[480px] flex-col gap-2.5">
              <button
                type="button"
                onClick={handleHacerReclamo}
                className="w-full rounded-[22px] bg-white px-6 py-3.5 text-[0.98rem] font-bold text-[#4C1182] shadow-[0_22px_44px_rgba(29,10,54,0.22)] transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.99]"
              >
                {hero.primaryCta}
              </button>
              <Link
                href="/consulta"
                className="w-full rounded-[22px] border border-white/16 bg-white/10 px-6 py-3.5 text-[0.98rem] font-semibold text-white transition-all duration-200 hover:bg-white/14 active:scale-[0.99]"
              >
                {hero.secondaryCta}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {showCategories && (
        <div ref={categoriesRef}>
          <CategoriasSection whatsappUrl={hero.whatsappUrl} />
        </div>
      )}
    </>
  );
}

export function HowItWorksSection({
  howItWorks,
}: {
  howItWorks: SiteContentBundle["howItWorks"];
}) {
  return (
    <section
      className="px-5 py-16 md:px-8 lg:px-[72px] lg:py-20"
      style={{
        background:
          "linear-gradient(180deg, #8B31D8 0%, #6B22C8 28%, #4C1182 100%)",
      }}
    >
      <div className="mx-auto max-w-[1366px]">
        <div className="max-w-[620px]">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/70">
            {howItWorks.eyebrow}
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-[-0.03em] text-white md:text-4xl">
            {howItWorks.title}
          </h2>
          <p className="mt-3 max-w-[540px] text-base leading-7 text-white/74">
            {howItWorks.description}
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3 lg:mt-12 lg:gap-6">
          {howItWorks.steps.map((step) => (
            <article
              key={step.num}
              className="rounded-[28px] border border-white/12 bg-white/10 p-6 shadow-[0_16px_40px_rgba(22,5,44,0.18)] backdrop-blur-sm"
            >
              <div
                className="flex h-12 w-12 items-center justify-center rounded-2xl text-sm font-bold text-white shadow-sm"
                style={{
                  background: "linear-gradient(135deg, #A855F7 0%, #F0ABFC 100%)",
                }}
              >
                {step.num}
              </div>
              <h3 className="mt-5 text-lg font-semibold text-white">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-white/72">{step.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
