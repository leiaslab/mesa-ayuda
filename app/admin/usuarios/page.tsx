import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import UsuariosClient from "./UsuariosClient";

export default async function UsuariosPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("users")
    .select("rol")
    .eq("id", user.id)
    .single();

  if (profile?.rol !== "super_admin") {
    redirect("/admin/dashboard");
  }

  const { data: usuarios } = await supabase
    .from("users")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#32105B]">Usuarios</h1>
        <p className="mt-1 text-sm text-gray-400">Gestión de administradores del sistema</p>
      </div>

      <UsuariosClient usuarios={usuarios ?? []} currentUserId={user.id} />
    </div>
  );
}
