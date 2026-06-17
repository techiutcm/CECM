"use client";

import type { BlogRole } from "@/types/blog";
import {
  BarChart3,
  Calendar,
  ClipboardList,
  GraduationCap,
  LayoutDashboard,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  minRole?: BlogRole;
}

const admissionsNav: NavItem[] = [
  { href: "/admin/admisiones", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/admisiones/solicitudes", label: "Solicitudes", icon: ClipboardList, minRole: "editor" },
  { href: "/admin/admisiones/entrevistas", label: "Entrevistas", icon: Calendar, minRole: "editor" },
  { href: "/admin/admisiones/estudiantes", label: "Estudiantes", icon: GraduationCap, minRole: "editor" },
  { href: "/admin/admisiones/reportes", label: "Reportes", icon: BarChart3, minRole: "editor" },
  { href: "/admin/admisiones/configuracion", label: "Configuración", icon: Settings, minRole: "admin" },
];

const blogNav: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, minRole: "author" },
  { href: "/admin/posts", label: "Posts", icon: ClipboardList, minRole: "author" },
];

function canAccess(roles: BlogRole[], minRole?: BlogRole) {
  if (!minRole) return true;
  const hierarchy: Record<BlogRole, BlogRole[]> = {
    reader: ["reader", "author", "editor", "admin"],
    author: ["author", "editor", "admin"],
    editor: ["editor", "admin"],
    admin: ["admin"],
  };
  return roles.some((role) => hierarchy[minRole].includes(role));
}

interface AdmissionsSidebarProps {
  roles: BlogRole[];
}

export function AdmissionsSidebar({ roles }: AdmissionsSidebarProps) {
  const pathname = usePathname();
  const visibleBlogNav = blogNav.filter((item) => canAccess(roles, item.minRole));

  return (
    <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col border-r border-[#083148]/10 bg-[#06121a] text-white">
      <div className="shrink-0 border-b border-white/10 px-6 py-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9b7fd4]">
          CRM Admisiones
        </p>
        <p className="mt-1 text-lg font-bold">Cristóbal Mendoza</p>
      </div>

      <nav className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto p-4">
        {admissionsNav
          .filter((item) => canAccess(roles, item.minRole))
          .map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/admin/admisiones"
                ? pathname === "/admin/admisiones"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-[#5B3E8C] text-white shadow-lg shadow-[#5B3E8C]/20"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
      </nav>

      <div className="shrink-0 space-y-1 border-t border-white/10 bg-[#06121a] p-4">
        {visibleBlogNav.length > 0 && (
          <>
            <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-white/60">
              Blog
            </p>
            {visibleBlogNav.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-white/75 transition hover:bg-white/5 hover:text-white"
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </Link>
              );
            })}
          </>
        )}
        <Link
          href="/"
          className="mt-2 block rounded-xl px-3 py-2 text-sm text-white/70 transition hover:bg-white/5 hover:text-white"
        >
          ← Volver al sitio
        </Link>
      </div>
    </aside>
  );
}
