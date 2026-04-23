import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export type Rol = "admin" | "super_admin";

export interface PerfilUsuario {
  id: string;
  nombre: string;
  rol: Rol;
  activo: boolean;
  email: string;
}

export async function getPerfilORedirect(): Promise<PerfilUsuario> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  const { data: perfil } = await supabase
    .from("users")
    .select("id, nombre, rol, activo")
    .eq("id", user.id)
    .single();

  if (!perfil || !perfil.activo) redirect("/admin/login");

  return {
    id: user.id,
    email: user.email ?? "",
    nombre: perfil.nombre,
    rol: perfil.rol as Rol,
    activo: perfil.activo,
  };
}

export async function requireSuperAdmin(): Promise<PerfilUsuario> {
  const perfil = await getPerfilORedirect();
  if (perfil.rol !== "super_admin") redirect("/admin/dashboard");
  return perfil;
}

export async function signOut() {
  "use server";
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}