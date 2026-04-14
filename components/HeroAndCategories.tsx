"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import CategoriasSection from "./CategoriasSection";

export default function HeroAndCategories() {
  const [showCategories, setShowCategories] = useState(false);
  const categoriesRef = useRef<HTMLDivElement>(null);

  const handleHacerReclamo = () => {
    if (showCategories) {
      categoriesRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      setShowCategories(true);
      setTimeout(() => {
        categoriesRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    }
  };

  return (
    <>
      {/* Hero */}
      <section
        className="flex flex-1 items-center justify-center overflow-hidden px-5 py-10 text-center md:px-8 md:py-12 lg:px-[72px] lg:py-0 lg:pb-8"
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
            <button
              onClick={handleHacerReclamo}
              className="flex w-full items-center justify-center gap-2.5 rounded-2xl bg-white py-3 text-base font-bold text-[#32105B] shadow-xl transition-transform active:scale-95 lg:py-[16px]"
            >
              <span className="text-lg">📝</span>
              Hacer un Reclamo
            </button>
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

      {/* Categorías — se muestra al hacer click en "Hacer un Reclamo" */}
      {showCategories && (
        <div ref={categoriesRef}>
          <CategoriasSection />
        </div>
      )}
    </>
  );
}
