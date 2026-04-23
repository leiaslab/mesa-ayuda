"use client";

import { useState, useEffect, Suspense } from "react";
import { createClient } from "@/lib/supabase/client";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

function AdminLoginForm() {
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (searchParams.get("error") === "cuenta_desactivada") {
      setError("Tu cuenta fue desactivada. Contactá al administrador.");
    }
  }, [searchParams]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError("Email o contraseña incorrectos.");
      setLoading(false);
      return;
    }

    window.location.href = "/admin/dashboard";
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0a1a] relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 20% 50%, #4C1182 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, #9333EA 0%, transparent 50%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 40px, #fff 40px, #fff 41px), repeating-linear-gradient(90deg, transparent, transparent 40px, #fff 40px, #fff 41px)",
        }}
      />

      <div className="relative z-10 w-full max-w-sm mx-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 mb-4">
            <Image
              src="/logo-lla-cropped.png"
              alt="La Libertad Avanza"
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Panel de Administración
          </h1>
          <p className="text-sm text-purple-300/70 mt-1">
            Mesa de Ayuda · Avellaneda
          </p>
        </div>

        <div className="bg-white/[0.06] backdrop-blur-xl border border-white/10 rounded-2xl p-7 shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-purple-200/80 mb-1.5 uppercase tracking-wider">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="tu@email.com"
                className="w-full rounded-xl bg-white/10 border border-white/15 px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-purple-400/60 focus:ring-2 focus:ring-purple-500/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-purple-200/80 mb-1.5 uppercase tracking-wider">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full rounded-xl bg-white/10 border border-white/15 px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-purple-400/60 focus:ring-2 focus:ring-purple-500/20 transition-all"
              />
            </div>

            {error && (
              <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3">
                <p className="text-xs text-red-300">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl py-3 text-sm font-bold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              style={{
                background: loading
                  ? "#6b21a8"
                  : "linear-gradient(135deg, #4C1182 0%, #9333EA 100%)",
                boxShadow: "0 4px 24px rgba(147,51,234,0.35)",
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                  Ingresando...
                </span>
              ) : (
                "Ingresar al panel"
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-[0.7rem] text-white/20 mt-6">
          Acceso restringido · Solo personal autorizado
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense>
      <AdminLoginForm />
    </Suspense>
  );
}