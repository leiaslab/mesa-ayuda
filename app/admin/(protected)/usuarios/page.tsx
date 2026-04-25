import { requireRole } from "@/lib/security/auth";
import UsuariosClient from "./UsuariosClient";

export default async function UsuariosPage() {
  const { supabase, user, role } = await requireRole("admin");

  const { data: usuarios } = await supabase
    .from("users")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-5 p-4 md:p-6 lg:p-8">
      <div>
        <h1 className="text-xl font-extrabold text-[#4C1182] md:text-2xl">Usuarios</h1>
        <p className="mt-1 text-sm text-gray-400">Gestión segura de administradores</p>
      </div>

      <UsuariosClient
        usuarios={usuarios ?? []}
        currentUserId={user.id}
        currentUserRole={role!}
      />
    </div>
  );
}
