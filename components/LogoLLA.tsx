"use client";

import { useState } from "react";

export default function LogoLLA() {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div
        style={{
          height: 64,
          width: 120,
          borderRadius: 12,
          background: "linear-gradient(135deg, #6011E8 0%, #32105B 100%)",
          color: "#fff",
          border: "2px solid rgba(255,255,255,0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 900,
          fontSize: 16,
          flexShrink: 0,
        }}
      >
        LLA
      </div>
    );
  }

  return (
    <img
      src="/logo-lla.png"
      alt="La Libertad Avanza"
      style={{
        height: 80,
        width: "auto",
        objectFit: "contain",
        flexShrink: 0,
      }}
    />
  );
}
