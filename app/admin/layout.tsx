import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Sidebar from "@/components/admin/Sidebar";
import type { UserRol } from "@/types/database";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Obtener perfil y rol del usuario
  const { data: profile } = await supabase
    .from("users")
    .select("nombre, email, rol, activo")
    .eq("id", user.id)
    .single();

  if (!profile || !profile.activo) {
    await supabase.auth.signOut();
    redirect("/login");
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar
        nombre={profile.nombre}
        email={profile.email}
        rol={profile.rol as UserRol}
      />

      <main className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-14 flex-shrink-0 items-center justify-between border-b border-gray-100 bg-white px-6 lg:px-8">
          <div className="lg:hidden w-10" /> {/* espacio para hamburger mobile */}
          <div className="hidden lg:flex items-center gap-2 text-xs text-gray-400">
            <span
              className="inline-flex rounded-full px-2.5 py-1 text-[0.65rem] font-bold text-white"
              style={{ backgroundColor: "#32105B" }}
            >
              {profile.rol === "super_admin" ? "Super Admin" : "Admin"}
            </span>
            <span>{profile.nombre}</span>
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <div className="h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
              style={{ backgroundColor: "#6011E8" }}>
              {profile.nombre.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
