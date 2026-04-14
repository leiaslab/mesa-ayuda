"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { UserRol } from "@/types/database";
import LogoLLA from "@/components/LogoLLA";

const NAV_ITEMS = [
  { href: "/admin/dashboard",      label: "Dashboard",      icon: "📊", roles: ["super_admin", "admin"] },
  { href: "/admin/reclamos",       label: "Reclamos",       icon: "📋", roles: ["super_admin", "admin"] },
  { href: "/admin/documentos",     label: "Documentos",     icon: "📁", roles: ["super_admin", "admin"] },
  { href: "/admin/usuarios",       label: "Usuarios",       icon: "👥", roles: ["super_admin"] },
  { href: "/admin/configuracion",  label: "Configuración",  icon: "⚙️", roles: ["super_admin"] },
] as const;

type Props = {
  nombre: string;
  email:  string;
  rol:    UserRol;
};

export default function Sidebar({ nombre, email, rol }: Props) {
  const pathname  = usePathname();
  const router    = useRouter();
  const supabase  = createClient();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const filteredNav = NAV_ITEMS.filter((item) =>
    (item.roles as readonly string[]).includes(rol)
  );

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/10">
        <LogoLLA className="h-auto w-[110px]" />
        <p className="mt-2 text-[0.65rem] font-semibold uppercase tracking-widest text-white/40">
          Panel administrativo
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {filteredNav.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                active
                  ? "bg-white/15 text-white shadow-sm"
                  : "text-white/60 hover:bg-white/8 hover:text-white"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
              {active && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#6011E8]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User + logout */}
      <div className="border-t border-white/10 px-4 py-4">
        <div className="mb-3 rounded-xl bg-white/8 px-3 py-2.5">
          <p className="text-xs font-bold text-white truncate">{nombre}</p>
          <p className="text-[0.65rem] text-white/40 truncate">{email}</p>
          <span className="mt-1 inline-flex rounded-full bg-[#6011E8]/30 px-2 py-0.5 text-[0.6rem] font-bold text-[#c8a4f8]">
            {rol === "super_admin" ? "Super Admin" : "Admin"}
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-white/50 transition-colors hover:bg-white/8 hover:text-white"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
          </svg>
          Cerrar sesión
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className="hidden lg:flex lg:w-60 lg:flex-shrink-0 lg:flex-col"
        style={{ backgroundColor: "#1e0a3c" }}
      >
        <SidebarContent />
      </aside>

      {/* Mobile hamburger */}
      <div className="lg:hidden">
        <button
          onClick={() => setOpen(true)}
          className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-xl shadow-lg"
          style={{ backgroundColor: "#32105B" }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>

        {/* Overlay */}
        {open && (
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
        )}

        {/* Drawer */}
        <div
          className={`fixed inset-y-0 left-0 z-50 w-64 flex flex-col transform transition-transform duration-300 ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
          style={{ backgroundColor: "#1e0a3c" }}
        >
          <button
            onClick={() => setOpen(false)}
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-white/50 hover:text-white"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
          <SidebarContent />
        </div>
      </div>
    </>
  );
}
