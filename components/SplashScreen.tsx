"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function SplashScreen({ src = "/splash.jpeg" }: { src?: string }) {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFading(true), 1700);
    const hideTimer = setTimeout(() => setVisible(false), 2000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-[#f4f0fa] px-4 transition-opacity duration-300 ${
        fading ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="w-full max-w-[340px] rounded-[28px] bg-white p-3 shadow-[0_20px_60px_rgba(40,14,74,0.22)] md:max-w-[400px]">
        <div className="overflow-hidden rounded-[20px]">
          <Image
            src={src}
            alt="Splash de entrada"
            width={572}
            height={800}
            priority
            unoptimized={src.startsWith("http")}
            className="h-auto w-full"
          />
        </div>
      </div>
    </div>
  );
}
