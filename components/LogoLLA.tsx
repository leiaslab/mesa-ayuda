"use client";

import { useState } from "react";

const SIZE = 234;

export default function LogoLLA() {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div
        style={{
          width: SIZE,
          height: SIZE,
          minWidth: SIZE,
          background: "linear-gradient(135deg, #6011E8 0%, #32105B 100%)",
          color: "#fff",
          border: "2px solid rgba(255,255,255,0.3)",
          borderRadius: 16,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 900,
          fontSize: 18,
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
        width: SIZE,
        height: SIZE,
        minWidth: SIZE,
        objectFit: "contain",
        flexShrink: 0,
      }}
      onError={() => setError(true)}
    />
  );
}
