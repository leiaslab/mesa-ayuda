"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { User, UserRol } from "@/types/database";

type Props = {
  usuarios:      User[];
  currentUserId: string;
};

export default function UsuariosClient({ usuarios, currentUserId }: Props) {
  const router   = useRouter();
  const supabase = createClient();

  const [showModal, setShowModal]   = useState(false);
  const [nombre,    setNombre]      = useState("");
  const [email,     setEmail]       = useState("");
  const [password,  setPassword]    = useState("");
  const [rol,       setRol]         = useState<UserRol>("admin");
  const [loading,   setLoading]     = useState(false);
  const [error,     setError]       = useState<string | null>(null);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/usuarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, email, password, rol }),
    });

    const json = await res.json();

    if (!res.ok) {
      setError(json.error ?? "Error al crear el usuario");
      setLoading(false);
      return;
    }

    setShowModal(false);
    setNombre(""); setEmail(""); setPassword("");
    router.refresh();
    setLoading(false);
  };

  const handleToggleActivo = async (id: string, activo: boolean) => {
    await supabase.from("users").update({ activo: !activo }).eq("id", id);
    router.refresh();
  };

  const handleChangeRol = async (id: string, newRol: UserRol) => {
    await supabase.from("users").update({ rol: newRol }).eq("id", id);
    router.refresh();
  };

  return (
    <>
      {/* Toolbar */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowModal(true)}
          className="rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-md"
          style={{ background: "linear-gradient(135deg, #32105B 0%, #6011E8 100%)" }}
        >
          + Nuevo admin
        </button>
      </div>

      {/* Tabla */}
      <div className="rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                {["Nombre", "Email", "Rol", "Estado", "Creado", "Acciones"].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-left text-[0.65rem] font-bold uppercase tracking-widest text-gray-400"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {usuarios.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50/50">
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-gray-800">{u.nombre}</p>
                    {u.id === currentUserId && (
                      <span className="text-[0.6rem] font-bold text-[#6011E8]">(vos)</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-xs text-gray-600">{u.email}</td>
                  <td className="px-5 py-3.5">
                    {u.id === currentUserId ? (
                      <span className="text-xs font-bold text-gray-500">
                        {u.rol === "super_admin" ? "Super Admin" : "Admin"}
                      </span>
                    ) : (
                      <select
                        value={u.rol}
                        onChange={(e) => handleChangeRol(u.id, e.target.value as UserRol)}
                        className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs text-gray-700 outline-none"
                      >
                        <option value="admin">Admin</option>
                        <option value="super_admin">Super Admin</option>
                      </select>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-[0.65rem] font-bold ${
                        u.activo ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {u.activo ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-gray-400">
                    {new Date(u.created_at).toLocaleDateString("es-AR")}
                  </td>
                  <td className="px-5 py-3.5">
                    {u.id !== currentUserId && (
                      <button
                        onClick={() => handleToggleActivo(u.id, u.activo)}
                        className={`text-xs font-semibold ${
                          u.activo ? "text-red-500 hover:underline" : "text-green-600 hover:underline"
                        }`}
                      >
                        {u.activo ? "Desactivar" : "Activar"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal crear usuario */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}
        >
          <div className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-2xl">
            <h2 className="mb-6 text-lg font-extrabold text-[#32105B]">Nuevo administrador</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              {[
                { label: "Nombre completo", value: nombre, setter: setNombre, type: "text",     placeholder: "Nombre Apellido" },
                { label: "Email",           value: email,  setter: setEmail,  type: "email",    placeholder: "admin@ejemplo.com" },
                { label: "Contraseña",      value: password, setter: setPassword, type: "password", placeholder: "Mínimo 8 caracteres" },
              ].map((f) => (
                <div key={f.label} className="flex flex-col gap-1.5">
                  <label className="text-[0.65rem] font-bold uppercase tracking-widest text-gray-400">
                    {f.label}
                  </label>
                  <input
                    type={f.type}
                    value={f.value}
                    onChange={(e) => f.setter(e.target.value)}
                    placeholder={f.placeholder}
                    required
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#6011E8] focus:ring-2 focus:ring-[#6011E8]/10"
                  />
                </div>
              ))}

              <div className="flex flex-col gap-1.5">
                <label className="text-[0.65rem] font-bold uppercase tracking-widest text-gray-400">
                  Rol
                </label>
                <select
                  value={rol}
                  onChange={(e) => setRol(e.target.value as UserRol)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#6011E8]"
                >
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>

              {error && (
                <p className="rounded-xl bg-red-50 px-3 py-2.5 text-xs font-medium text-red-600">
                  {error}
                </p>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 rounded-2xl border border-gray-200 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 rounded-2xl py-3 text-sm font-bold text-white disabled:opacity-60"
                  style={{ background: "linear-gradient(135deg, #32105B 0%, #6011E8 100%)" }}
                >
                  {loading ? "Creando..." : "Crear"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
