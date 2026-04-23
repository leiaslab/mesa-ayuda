"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import LogoLLA from "@/components/LogoLLA";

export default function PrivateLoginClient({ redirectTo }: { redirectTo: string | null }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, redirectTo }),
    });

    const payload = await response.json();

    if (!response.ok) {
      setError(payload.error ?? "No pudimos validar el acceso. Intentá de nuevo.");
      setLoading(false);
      return;
    }

    router.push(payload.redirectTo);
    router.refresh();
  };

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center px-4"
      style={{
        background: "linear-gradient(145deg, #0F0438 0%, #2D0A69 50%, #7C3AED 100%)",
      }}
    >
      <div className="w-full max-w-sm rounded-3xl bg-white px-8 py-10 shadow-2xl">
        <div className="mb-8 flex flex-col items-center gap-3">
          <LogoLLA className="h-auto w-[120px]" />
          <div className="text-center">
            <h1 className="text-lg font-extrabold text-[#4C1182]">Ingreso interno</h1>
            <p className="text-xs text-gray-400">Acceso reservado para administración</p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[0.7rem] font-bold uppercase tracking-widest text-gray-400">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="admin@ejemplo.com"
              required
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition-all placeholder:text-gray-300 focus:border-[#9333EA] focus:ring-2 focus:ring-[#9333EA]/15"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[0.7rem] font-bold uppercase tracking-widest text-gray-400">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              required
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition-all placeholder:text-gray-300 focus:border-[#9333EA] focus:ring-2 focus:ring-[#9333EA]/15"
            />
          </div>

          {error && (
            <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-2xl py-3.5 text-sm font-bold text-white shadow-md transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60"
            style={{ background: "linear-gradient(135deg, #4C1182 0%, #9333EA 100%)" }}
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-gray-300">
          Acceso no visible desde la home pública
        </p>
      </div>
    </div>
  );
}
