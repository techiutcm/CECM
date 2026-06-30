"use client";

import type { BlogRole } from "@/types/blog";
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  GraduationCap,
  Home,
  LayoutDashboard,
  MessageSquare,
  Tags,
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

const STORAGE_KEY = "blog-sidebar-collapsed";

const navItems: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/admisiones", label: "Admisiones CRM", icon: GraduationCap, minRole: "editor" },
  { href: "/admin/posts", label: "Posts", icon: FileText, minRole: "author" },
  { href: "/admin/tags", label: "Etiquetas", icon: Tags, minRole: "editor" },
  { href: "/admin/comments", label: "Comentarios", icon: MessageSquare, minRole: "editor" },
  { href: "/admin/usuarios", label: "Usuarios", icon: Users, minRole: "admin" },
];

interface SidebarProps {
  roles: BlogRole[];
}

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
      className={`flex items-center rounded-lg text-sm font-medium transition ${
        collapsed ? "justify-center px-2 py-2.5" : "gap-3 px-3 py-2.5"
      } ${
        isActive
          ? "bg-emerald-50 text-emerald-800"
          : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
      }`}
    >
      <Icon className="h-4 w-4 shrink-0" />
      {!collapsed && <span className="truncate">{item.label}</span>}
    </Link>
  );
}

export function Sidebar({ roles }: SidebarProps) {
  const pathname = usePathname();
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
      className={`sticky top-0 flex h-screen shrink-0 flex-col overflow-hidden border-r border-zinc-200 bg-white transition-[width] duration-300 ease-in-out ${
        collapsed ? "w-[4.5rem]" : "w-64"
      } ${isReady ? "opacity-100" : "opacity-0"}`}
    >
      <div
        className={`shrink-0 border-b border-zinc-200 ${
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
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700"
                title="Admin Blog"
              >
                <FileText className="h-5 w-5" />
              </div>
            ) : (
              <>
                <p className="text-xs font-medium uppercase tracking-wider text-emerald-700">
                  Admin
                </p>
                <p className="mt-1 truncate text-lg font-bold text-zinc-900">
                  Cristobal Mendoza
                </p>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={toggleCollapsed}
            aria-label={collapsed ? "Expandir menú" : "Contraer menú"}
            aria-expanded={!collapsed}
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900 ${
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
        {navItems
          .filter((item) => canAccess(roles, item.minRole))
          .map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
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
        className={`shrink-0 border-t border-zinc-200 bg-white ${
          collapsed ? "p-2" : "p-4"
        }`}
      >
        <Link
          href="/"
          title={collapsed ? "Volver al sitio" : undefined}
          aria-label="Volver al sitio"
          className={`flex items-center rounded-lg text-sm text-zinc-500 transition hover:bg-zinc-50 hover:text-zinc-900 ${
            collapsed ? "justify-center px-2 py-2.5" : "gap-3 px-3 py-2.5"
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
