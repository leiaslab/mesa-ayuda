"use client";

import { useState } from "react";
import ReclamoWizard from "./ReclamoWizard";

const categories = [
  {
    icon: "🛣️",
    label: "Calles",
    key: "calles",
    desc: "Baches, veredas, poda y señalización",
  },
  {
    icon: "💡",
    label: "Alumbrado",
    key: "alumbrado",
    desc: "Falta o reparación de iluminaria pública",
  },
  {
    icon: "💧",
    label: "Aguas",
    key: "aguas",
    desc: "Bocas de tormenta, pérdidas y cloacas",
  },
  {
    icon: "🗑️",
    label: "Basura",
    key: "basura",
    desc: "Recolección y contenedores",
  },
  {
    icon: "🌊",
    label: "Inundación",
    key: "inundacion",
    desc: "Anegamientos y desagüe",
  },
  {
    icon: "🔒",
    label: "Inseguridad",
    key: "inseguridad",
    desc: "Cámaras y presencia policial",
  },
  {
    icon: "📋",
    label: "Otros",
    key: "otros",
    desc: "Otros reclamos vecinales",
    wide: true,
  },
];

export default function CategoriasSection({
  whatsappUrl,
}: {
  whatsappUrl: string;
}) {
  const [wizardOpen, setWizardOpen] = useState(false);
  const [selectedCategoria, setSelectedCategoria] = useState("");

  const openWizard = (key: string) => {
    setSelectedCategoria(key);
    setWizardOpen(true);
  };

  const closeWizard = () => {
    setWizardOpen(false);
    setSelectedCategoria("");
  };

  return (
    <>
      <section className="bg-white px-5 py-14 md:px-8 lg:px-[72px] lg:py-16">
        <div className="mx-auto max-w-[1366px]">
          <div className="max-w-[640px]">
            <h2 className="text-3xl font-bold tracking-[-0.03em] text-[#4C1182] md:text-4xl">
              ¿Qué necesitás reportar?
            </h2>
            <p className="mt-3 text-base leading-7 text-[#776c90]">
              Seleccioná la categoría de tu reclamo para abrir el formulario correspondiente.
            </p>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:mt-10 lg:grid-cols-4 lg:gap-4">
            {categories.map((cat) => (
              <button
                key={cat.key}
                type="button"
                onClick={() => openWizard(cat.key)}
                className={`rounded-[24px] border border-[#efe6fb] bg-[#fbf8ff] p-5 text-left shadow-[0_14px_36px_rgba(61,16,109,0.08)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(61,16,109,0.12)] active:scale-[0.99] ${
                  cat.wide
                    ? "flex flex-row items-center gap-3 sm:col-span-2 lg:col-span-2"
                    : "flex flex-col gap-3"
                }`}
              >
                <span className="text-3xl">{cat.icon}</span>
                <div>
                  <p className="text-base font-semibold leading-tight text-[#4C1182]">
                    {cat.label}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-[#7d7097]">{cat.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {wizardOpen && selectedCategoria && (
        <ReclamoWizard
          categoria={selectedCategoria}
          onClose={closeWizard}
          whatsappUrl={whatsappUrl}
        />
      )}
    </>
  );
}
