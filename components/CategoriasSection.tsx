"use client";

import { useState } from "react";
import ReclamoWizard from "./ReclamoWizard";

const categories = [
  {
    icon: "🛣️",
    label: "Calles",
    key: "calles",
    desc: "Baches, cordones, veredas",
  },
  {
    icon: "💡",
    label: "Alumbrado",
    key: "alumbrado",
    desc: "Postes y luminarias",
  },
  {
    icon: "💧",
    label: "Aguas",
    key: "aguas",
    desc: "Pérdidas y cloacas",
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
    desc: "Iluminación y espacios",
  },
  {
    icon: "📋",
    label: "Otros",
    key: "otros",
    desc: "Otros reclamos vecinales",
    wide: true,
  },
];

export default function CategoriasSection() {
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
              <button
                key={cat.key}
                onClick={() => openWizard(cat.key)}
                className={`rounded-2xl bg-white p-4 shadow-sm transition-all hover:shadow-md active:scale-95 text-left ${
                  cat.wide ? "col-span-2 flex flex-row items-center gap-3" : "flex flex-col gap-3"
                }`}
                style={{ border: "1px solid #F0EBF8" }}
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
              </button>
            ))}
          </div>
        </div>
      </section>

      {wizardOpen && selectedCategoria && (
        <ReclamoWizard categoria={selectedCategoria} onClose={closeWizard} />
      )}
    </>
  );
}
