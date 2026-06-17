"use client";

import { nosotrosPages } from "@/lib/site/nosotros";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function NosotrosSubnav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Secciones de Nosotros"
      className="border-b border-[#083148]/10 bg-white/95 backdrop-blur-md"
    >
      <div className="mx-auto flex w-full max-w-7xl gap-1 overflow-x-auto px-6 py-3 sm:px-10 lg:px-12">
        {nosotrosPages.map((page) => {
          const isActive = pathname === page.href;

          return (
            <Link
              key={page.href}
              href={page.href}
              className={cn(
                "shrink-0 rounded-full px-4 py-2 font-montserrat text-xs font-semibold uppercase tracking-wide transition sm:text-sm",
                isActive
                  ? "bg-[#083148] text-white shadow-md"
                  : "text-[#083148]/65 hover:bg-[#083148]/5 hover:text-[#083148]",
              )}
            >
              {page.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
