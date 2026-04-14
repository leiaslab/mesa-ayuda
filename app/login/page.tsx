"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import LogoLLA from "@/components/LogoLLA";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError("Credenciales inválidas. Verificá tu email y contraseña.");
      setLoading(false);
      return;
    }

    router.push("/admin/dashboard");
    router.refresh();
  };

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center px-4"
      style={{
        background: "linear-gradient(145deg, #1a0835 0%, #32105B 50%, #4a18a0 100%)",
      }}
    >
      {/* Card */}
      <div className="w-full max-w-sm rounded-3xl bg-white px-8 py-10 shadow-2xl">

        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <LogoLLA className="h-auto w-[120px]" />
          <div className="text-center">
            <h1 className="text-lg font-extrabold text-[#32105B]">Mesa de Ayuda</h1>
            <p className="text-xs text-gray-400">Panel administrativo</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[0.7rem] font-bold uppercase tracking-widest text-gray-400">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@ejemplo.com"
              required
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition-all focus:border-[#6011E8] focus:ring-2 focus:ring-[#6011E8]/15 placeholder:text-gray-300"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[0.7rem] font-bold uppercase tracking-widest text-gray-400">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition-all focus:border-[#6011E8] focus:ring-2 focus:ring-[#6011E8]/15 placeholder:text-gray-300"
            />
          </div>

          {error && (
            <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600 border border-red-100">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-2xl py-3.5 text-sm font-bold text-white shadow-md transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60"
            style={{ background: "linear-gradient(135deg, #32105B 0%, #6011E8 100%)" }}
          >
            {loading ? "Ingresando..." : "Ingresar al panel"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-gray-300">
          Bloque La Libertad Avanza Avellaneda
        </p>
      </div>
    </div>
  );
}
