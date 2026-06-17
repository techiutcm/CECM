"use client";

import type { BlogRole } from "@/types/blog";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  href: string;
  label: string;
  minRole?: BlogRole;
}

const navItems: NavItem[] = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/admisiones", label: "Admisiones CRM", minRole: "editor" },
  { href: "/admin/posts", label: "Posts", minRole: "author" },
  { href: "/admin/tags", label: "Etiquetas", minRole: "editor" },
  { href: "/admin/comments", label: "Comentarios", minRole: "editor" },
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

export function Sidebar({ roles }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col border-r border-zinc-200 bg-white">
      <div className="shrink-0 border-b border-zinc-200 px-6 py-5">
        <p className="text-xs font-medium uppercase tracking-wider text-emerald-700">
          Admin
        </p>
        <p className="mt-1 text-lg font-bold text-zinc-900">Cristobal Mendoza</p>
      </div>

      <nav className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto p-4">
        {navItems
          .filter((item) => canAccess(roles, item.minRole))
          .map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-emerald-50 text-emerald-800"
                    : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
      </nav>

      <div className="shrink-0 border-t border-zinc-200 bg-white p-4">
        <Link
          href="/"
          className="block rounded-lg px-3 py-2.5 text-sm text-zinc-500 transition hover:bg-zinc-50 hover:text-zinc-900"
        >
          ← Volver al sitio
        </Link>
      </div>
    </aside>
  );
}
