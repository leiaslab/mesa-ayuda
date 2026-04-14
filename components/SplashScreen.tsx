"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [fading,  setFading]  = useState(false);

  useEffect(() => {
    // Iniciar fade-out 300ms antes del unmount
    const fadeTimer = setTimeout(() => setFading(true),  2700);
    const hideTimer = setTimeout(() => setVisible(false), 3000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black transition-opacity duration-300 ${
        fading ? "opacity-0" : "opacity-100"
      }`}
    >
      <Image
        src="/splash.png"
        alt="Mesa de Ayuda"
        width={160}
        height={160}
        className="h-auto w-40"
        priority
      />
    </div>
  );
}
