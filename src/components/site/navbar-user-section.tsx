"use client";

import { signOut } from "@/app/actions/auth";
import type { NavbarSession } from "@/lib/auth/navbar-session";
import Link from "next/link";

interface NavbarUserSectionProps {
  session: NavbarSession;
  onNavigate?: () => void;
  layout?: "inline" | "stacked";
}

const logoutButtonClass =
  "font-montserrat rounded-full border border-white/25 px-4 py-2 text-[11px] font-bold uppercase tracking-wide text-white transition hover:bg-white/10 active:scale-95 lg:text-xs";

const panelLinkClass =
  "font-montserrat hidden rounded-full border border-white/20 px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-white/85 transition hover:bg-white/10 hover:text-white md:inline-flex lg:text-xs";

export function NavbarUserSection({
  session,
  onNavigate,
  layout = "inline",
}: NavbarUserSectionProps) {
  const { firstName, initial, panelHref } = session;

  if (layout === "stacked") {
    return (
      <div className="mt-4 space-y-3 border-t border-white/10 pt-4">
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F9B214] text-sm font-bold text-[#083148]">
            {initial}
          </span>
          <div className="min-w-0">
            <p className="font-montserrat truncate text-sm font-semibold text-white">
              {firstName}
            </p>
            <p className="font-montserrat text-xs text-white/55">Sesión activa</p>
          </div>
        </div>

        {panelHref && (
          <Link
            href={panelHref}
            onClick={onNavigate}
            className="font-montserrat flex w-full items-center justify-center rounded-full border border-white/20 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-white/10"
          >
            Panel
          </Link>
        )}

        <form action={signOut} className="w-full">
          <button
            type="submit"
            className="font-montserrat w-full rounded-full border border-white/25 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-white/10 active:scale-[0.98]"
          >
            Cerrar sesión
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="hidden items-center gap-2 sm:flex">
      <div
        className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 py-1.5 pl-1.5 pr-3"
        title={firstName}
      >
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#F9B214] text-xs font-bold text-[#083148]">
          {initial}
        </span>
        <span className="font-montserrat max-w-[88px] truncate text-xs font-semibold text-white lg:max-w-[120px]">
          {firstName}
        </span>
      </div>

      {panelHref && (
        <Link href={panelHref} className={panelLinkClass}>
          Panel
        </Link>
      )}

      <form action={signOut}>
        <button type="submit" className={logoutButtonClass}>
          Cerrar sesión
        </button>
      </form>
    </div>
  );
}
