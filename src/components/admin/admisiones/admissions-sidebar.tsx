"use client";

import type { BlogRole } from "@/types/blog";
import {
  BarChart3,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  GraduationCap,
  Home,
  LayoutDashboard,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  minRole?: BlogRole;
}

const STORAGE_KEY = "admissions-sidebar-collapsed";

const admissionsNav: NavItem[] = [
  { href: "/admin/admisiones", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/admisiones/solicitudes", label: "Solicitudes", icon: ClipboardList, minRole: "editor" },
  { href: "/admin/admisiones/entrevistas", label: "Entrevistas", icon: Calendar, minRole: "editor" },
  { href: "/admin/admisiones/estudiantes", label: "Estudiantes", icon: GraduationCap, minRole: "editor" },
  { href: "/admin/admisiones/reportes", label: "Reportes", icon: BarChart3, minRole: "editor" },
  { href: "/admin/admisiones/configuracion", label: "Usuarios y config.", icon: Users, minRole: "admin" },
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

function NavLink({
  item,
  isActive,
  collapsed,
}: {
  item: NavItem;
  isActive: boolean;
  collapsed: boolean;
}) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      title={collapsed ? item.label : undefined}
      aria-label={item.label}
      className={`flex items-center rounded-xl text-sm font-medium transition ${
        collapsed ? "justify-center px-2 py-2.5" : "gap-3 px-3 py-2.5"
      } ${
        isActive
          ? "bg-[#5B3E8C] text-white shadow-lg shadow-[#5B3E8C]/20"
          : "text-white/70 hover:bg-white/5 hover:text-white"
      }`}
    >
      <Icon className="h-4 w-4 shrink-0" />
      {!collapsed && <span className="truncate">{item.label}</span>}
    </Link>
  );
}

export function AdmissionsSidebar({ roles }: AdmissionsSidebarProps) {
  const pathname = usePathname();
  const visibleBlogNav = blogNav.filter((item) => canAccess(roles, item.minRole));
  const [collapsed, setCollapsed] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "true") {
      setCollapsed(true);
    }
    setIsReady(true);
  }, []);

  function toggleCollapsed() {
    setCollapsed((current) => {
      const next = !current;
      window.localStorage.setItem(STORAGE_KEY, String(next));
      return next;
    });
  }

  return (
    <aside
      className={`sticky top-0 flex h-screen shrink-0 flex-col overflow-hidden border-r border-[#083148]/10 bg-[#06121a] text-white transition-[width] duration-300 ease-in-out ${
        collapsed ? "w-[4.5rem]" : "w-64"
      } ${isReady ? "opacity-100" : "opacity-0"}`}
    >
      <div
        className={`shrink-0 border-b border-white/10 ${
          collapsed ? "px-2 py-4" : "px-4 py-5"
        }`}
      >
        <div
          className={`flex items-start gap-2 ${
            collapsed ? "flex-col items-center" : "justify-between"
          }`}
        >
          <div className={collapsed ? "flex flex-col items-center" : "min-w-0 flex-1"}>
            {collapsed ? (
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#5B3E8C]/30 text-[#c4b5fd]"
                title="CRM Admisiones"
              >
                <GraduationCap className="h-5 w-5" />
              </div>
            ) : (
              <>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9b7fd4]">
                  CRM Admisiones
                </p>
                <p className="mt-1 truncate text-lg font-bold">Cristóbal Mendoza</p>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={toggleCollapsed}
            aria-label={collapsed ? "Expandir menú" : "Contraer menú"}
            aria-expanded={!collapsed}
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white/70 transition hover:bg-white/10 hover:text-white ${
              collapsed ? "mt-2" : ""
            }`}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      <nav
        className={`flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto overflow-x-hidden ${
          collapsed ? "p-2" : "p-4"
        }`}
      >
        {admissionsNav
          .filter((item) => canAccess(roles, item.minRole))
          .map((item) => {
            const isActive =
              item.href === "/admin/admisiones"
                ? pathname === "/admin/admisiones"
                : pathname.startsWith(item.href);

            return (
              <NavLink
                key={item.href}
                item={item}
                isActive={isActive}
                collapsed={collapsed}
              />
            );
          })}
      </nav>

      <div
        className={`shrink-0 space-y-1 border-t border-white/10 bg-[#06121a] ${
          collapsed ? "p-2" : "p-4"
        }`}
      >
        {visibleBlogNav.length > 0 && (
          <>
            {!collapsed && (
              <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-white/60">
                Blog
              </p>
            )}
            {visibleBlogNav.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={collapsed ? item.label : undefined}
                  aria-label={item.label}
                  className={`flex items-center rounded-xl text-sm text-white/75 transition hover:bg-white/5 hover:text-white ${
                    collapsed ? "justify-center px-2 py-2" : "gap-3 px-3 py-2"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </Link>
              );
            })}
          </>
        )}
        <Link
          href="/"
          title={collapsed ? "Volver al sitio" : undefined}
          aria-label="Volver al sitio"
          className={`mt-2 flex items-center rounded-xl text-sm text-white/70 transition hover:bg-white/5 hover:text-white ${
            collapsed ? "justify-center px-2 py-2" : "gap-3 px-3 py-2"
          }`}
        >
          {collapsed ? (
            <Home className="h-4 w-4 shrink-0" />
          ) : (
            "← Volver al sitio"
          )}
        </Link>
      </div>
    </aside>
  );
}
