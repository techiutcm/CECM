"use client";

import type { FooterNavGroup } from "@/lib/site/footer";
import { NavLinkIndicator } from "@/components/site/nav-link-indicator";
import { usePathname } from "next/navigation";

interface FooterNavigationProps {
  groups: FooterNavGroup[];
}

export function FooterNavigation({ groups }: FooterNavigationProps) {
  const pathname = usePathname();

  function isLinkActive(href: string) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <nav aria-label="Navegación del sitio" className="order-3 md:col-span-2 lg:order-3 lg:col-span-1">
      <div className="grid gap-8 sm:grid-cols-2 sm:gap-10">
        {groups.map((group) => (
          <div key={group.title}>
            <h3 className="font-montserrat text-xs font-bold uppercase tracking-[0.2em] text-[#083148]/50">
              {group.title}
            </h3>
            <ul className="mt-4 space-y-3">
              {group.links.map((link) => (
                <li key={`${group.title}-${link.href}-${link.label}`}>
                  <NavLinkIndicator
                    href={link.href}
                    active={isLinkActive(link.href)}
                    className="font-montserrat text-sm text-[#083148]/78 hover:text-[#083148]"
                  >
                    {link.label}
                  </NavLinkIndicator>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </nav>
  );
}
