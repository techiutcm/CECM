"use client";

import { signOut } from "@/app/actions/auth";
import type { AuthUser } from "@/types/blog";
import { Bell, Search } from "lucide-react";

interface AdmissionsHeaderProps {
  user: AuthUser;
  title: string;
  description?: string;
  searchPlaceholder?: string;
}

export function AdmissionsHeader({
  user,
  title,
  description,
  searchPlaceholder = "Buscar estudiante, representante o cédula...",
}: AdmissionsHeaderProps) {
  const displayName =
    user.profile?.full_name ?? user.profile?.username ?? user.email ?? "Usuario";

  return (
    <header className="sticky top-0 z-20 border-b border-[#083148]/10 bg-white/90 px-6 py-4 backdrop-blur-md">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#083148]">{title}</h1>
          {description && <p className="mt-1 text-sm text-[#083148]/60">{description}</p>}
        </div>

        <div className="flex flex-1 items-center gap-3 lg:max-w-2xl lg:justify-end">
          <div className="relative hidden min-w-0 flex-1 md:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#083148]/40" />
            <input
              type="search"
              placeholder={searchPlaceholder}
              className="h-10 w-full rounded-xl border border-[#083148]/10 bg-[#f7f9fc] pl-10 pr-4 text-sm text-[#083148] outline-none transition focus:border-[#5B3E8C]/40 focus:ring-4 focus:ring-[#5B3E8C]/10"
              aria-label="Buscador global"
            />
          </div>

          <button
            type="button"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-[#083148]/10 bg-white text-[#083148] transition hover:bg-[#f7f9fc]"
            aria-label="Notificaciones"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#5B3E8C]" />
          </button>

          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-[#083148]">{displayName}</p>
            <p className="text-xs capitalize text-[#083148]/50">
              {user.roles[user.roles.length - 1]}
            </p>
          </div>

          <form action={signOut}>
            <button
              type="submit"
              className="rounded-xl border border-[#083148]/10 px-3 py-2 text-sm text-[#083148]/70 transition hover:bg-[#f7f9fc]"
            >
              Salir
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
