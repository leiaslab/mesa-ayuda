import Sidebar from "@/components/admin/Sidebar";
import { requireRole } from "@/lib/security/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { profile, role } = await requireRole("admin");
  if (!profile || !role) return null;

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar
        nombre={profile.nombre}
        email={profile.email}
        rol={role}
      />

      <main className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-14 flex-shrink-0 items-center border-b border-gray-100 bg-white px-4 lg:px-8">
          {/* Espacio para el botón hamburger en mobile (posicionado fixed) */}
          <div className="w-12 flex-shrink-0 lg:hidden" />
          <div className="hidden lg:flex items-center gap-2 text-xs text-gray-400">
            <span
              className="inline-flex rounded-full px-2.5 py-1 text-[0.65rem] font-bold text-white"
              style={{ backgroundColor: "#4C1182" }}
            >
              {role === "super_admin" ? "Super Admin" : "Admin"}
            </span>
            <span>{profile.nombre}</span>
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <div
              className="h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
              style={{ backgroundColor: "#9333EA" }}
            >
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
