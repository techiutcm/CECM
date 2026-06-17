"use client";

import { getNavbarRevealMotion } from "@/hooks/use-section-scroll-reveal";
import type { NavbarSession } from "@/lib/auth/navbar-session";
import { getVisibleNavigation } from "@/lib/site/navigation";
import { NavbarUserSection } from "@/components/site/navbar-user-section";
import { NavIndicatorBar, NavLinkIndicator } from "@/components/site/nav-link-indicator";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface NavbarProps {
  scrollProgress?: number;
  isMobile?: boolean;
  session?: NavbarSession | null;
}

const navLinkBase =
  "font-montserrat rounded-lg px-2.5 py-2 text-[11px] font-semibold uppercase tracking-wide transition-all duration-200 lg:px-3 lg:text-xs";

const navLinkIdle = "text-white/90 hover:bg-white/10 hover:text-[#F9B214] hover:translate-x-0.5";
const navLinkActive = "bg-white/15 text-[#F9B214]";
const navLinkPressed = "active:bg-white/20 active:text-white";

const navCtaBase =
  "font-montserrat rounded-full px-4 py-2 text-[11px] font-bold uppercase tracking-wide transition lg:px-5 lg:text-xs";

const navCtaIdle =
  "bg-[#F9B214] text-[#083148] shadow-md hover:bg-[#e5a012] active:scale-95";

const navCtaActive = "bg-[#F9B214] text-[#083148] ring-2 ring-white/30";

export function Navbar({
  scrollProgress = 1,
  isMobile = false,
  session = null,
}: NavbarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const navbarMotion = getNavbarRevealMotion(scrollProgress, isMobile);
  const visibleNavigation = getVisibleNavigation();

  function isLinkActive(href?: string) {
    if (!href) return false;
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  function navItemClass(href?: string, isOpen = false) {
    const active = isOpen || isLinkActive(href);
    return `${navLinkBase} ${active ? navLinkActive : navLinkIdle} ${navLinkPressed}`;
  }

  return (
    <header className="absolute inset-x-0 top-0 z-50 px-6 pt-4 sm:px-10 lg:px-12">
      <div
        className="mx-auto w-full max-w-7xl will-change-transform"
        style={{
          transform: navbarMotion.transform,
          opacity: navbarMotion.opacity,
        }}
      >
        <div className="flex items-center justify-between gap-4 rounded-[2rem] bg-[#083148] px-4 py-3 shadow-lg shadow-black/25 sm:px-6">
          {/* Logo */}
          <Link
            href="/"
            className="flex shrink-0 items-center rounded-xl p-1 transition hover:bg-white/10 active:bg-white/15"
          >
            <Image
              src="/logo-navbar.png"
              alt="Complejo Educativo Dr. Cristóbal Mendoza"
              width={48}
              height={48}
              className="h-10 w-10 object-contain sm:h-11 sm:w-11"
              priority
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-0.5 xl:flex">
            {visibleNavigation.map((item) => {
              const isOpen = openDropdown === item.label;
              const isDirectLink = item.href && !item.sections && !item.items;

              return (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() =>
                    !isDirectLink ? setOpenDropdown(item.label) : undefined
                  }
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  {isDirectLink ? (
                    item.highlight ? (
                      <Link
                        href={item.href!}
                        className={`${navCtaBase} ${isLinkActive(item.href) ? navCtaActive : navCtaIdle}`}
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <NavLinkIndicator
                        href={item.href!}
                        active={isLinkActive(item.href)}
                        className={navItemClass(item.href)}
                      >
                        {item.label}
                      </NavLinkIndicator>
                    )
                  ) : (
                    <>
                      <button
                        type="button"
                        className={`${navItemClass(undefined, isOpen)} group inline-flex items-center gap-0.5 hover:translate-x-0.5`}
                        aria-expanded={isOpen}
                      >
                        <NavIndicatorBar active={isOpen} />
                        <span className="max-w-[120px] truncate lg:max-w-none">
                          {item.label}
                        </span>
                        <svg
                          className={`h-3 w-3 shrink-0 transition ${isOpen ? "rotate-180 text-[#F9B214]" : ""}`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {isOpen && (
                        <div className="absolute left-1/2 top-full z-50 -translate-x-1/2 pt-3">
                          <div className="min-w-[300px] overflow-hidden rounded-2xl border border-white/10 bg-white shadow-2xl shadow-black/30">
                            {item.sections?.map((section, idx) => (
                              <div
                                key={section.title ?? idx}
                                className={idx > 0 ? "border-t border-zinc-100" : ""}
                              >
                                {section.title && (
                                  <p className="font-montserrat px-4 pt-3 text-[10px] font-bold uppercase tracking-wider text-[#DB2B2C]">
                                    {section.title}
                                  </p>
                                )}
                                <ul className="p-2">
                                  {section.items.map((link) => (
                                    <li key={link.href}>
                                      <NavLinkIndicator
                                        href={link.href}
                                        active={isLinkActive(link.href)}
                                        className={`w-full items-start rounded-xl px-3 py-2.5 ${
                                          isLinkActive(link.href)
                                            ? "bg-[#083148]/10 text-[#083148]"
                                            : "text-[#083148]/80 hover:bg-[#083148]/5 hover:text-[#083148] active:bg-[#083148]/15"
                                        }`}
                                      >
                                        <div>
                                          <span className="font-montserrat block text-sm font-semibold">
                                            {link.label}
                                          </span>
                                          {link.description && (
                                            <span className="mt-0.5 block text-xs font-normal text-zinc-500">
                                              {link.description}
                                            </span>
                                          )}
                                        </div>
                                      </NavLinkIndicator>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}

                            {item.items && !item.sections && (
                              <ul className="p-2">
                                {item.items.map((link) => (
                                  <li key={link.href}>
                                    <NavLinkIndicator
                                      href={link.href}
                                      active={isLinkActive(link.href)}
                                      className={`w-full items-start rounded-xl px-3 py-2.5 ${
                                        isLinkActive(link.href)
                                          ? "bg-[#083148]/10 text-[#083148]"
                                          : "text-[#083148]/80 hover:bg-[#083148]/5 hover:text-[#083148] active:bg-[#083148]/15"
                                      }`}
                                    >
                                      <div>
                                        <span className="font-montserrat block text-sm font-semibold">
                                          {link.label}
                                        </span>
                                        {link.description && (
                                          <span className="mt-0.5 block text-xs font-normal text-zinc-500">
                                            {link.description}
                                          </span>
                                        )}
                                      </div>
                                    </NavLinkIndicator>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </nav>

          {/* CTA + mobile toggle */}
          <div className="flex items-center gap-2">
            {session ? (
              <NavbarUserSection session={session} />
            ) : (
              <Link
                href="/login"
                className="font-montserrat hidden rounded-full bg-[#DB2B2C] px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-white shadow-md transition hover:bg-[#F9B214] hover:text-[#083148] active:scale-95 active:bg-[#e5a012] sm:inline-flex"
              >
                Iniciar sesión
              </Link>
            )}

            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`inline-flex rounded-lg p-2 text-white transition xl:hidden ${
                mobileOpen ? "bg-white/15 text-[#F9B214]" : "hover:bg-white/10 active:bg-white/20"
              }`}
              aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="mt-2 overflow-hidden rounded-2xl border border-white/10 bg-[#083148] shadow-xl xl:hidden">
            <nav className="max-h-[70vh] overflow-y-auto px-4 py-4">
              {visibleNavigation.map((item) => (
                <div key={item.label} className="border-b border-white/10 py-3 last:border-0">
                  {item.href && !item.sections && !item.items ? (
                    item.highlight ? (
                      <Link
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className="font-montserrat block rounded-full bg-[#F9B214] py-3 text-center text-sm font-bold uppercase tracking-wide text-[#083148] transition hover:bg-[#e5a012] active:scale-[0.98]"
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <NavLinkIndicator
                        href={item.href}
                        active={isLinkActive(item.href)}
                        onClick={() => setMobileOpen(false)}
                        className={`rounded-lg px-2 py-1.5 text-sm font-semibold uppercase ${
                          isLinkActive(item.href)
                            ? "bg-white/15 text-[#F9B214]"
                            : "text-white hover:bg-white/10 hover:text-[#F9B214] active:bg-white/20"
                        }`}
                      >
                        {item.label}
                      </NavLinkIndicator>
                    )
                  ) : (
                    <>
                      <p className="font-montserrat px-2 text-sm font-bold uppercase text-white">
                        {item.label}
                      </p>
                      <ul className="mt-2 space-y-0.5 border-l-2 border-[#F9B214]/40 pl-3">
                        {item.sections?.flatMap((s) => s.items).map((link) => (
                          <li key={link.href}>
                            <NavLinkIndicator
                              href={link.href}
                              active={isLinkActive(link.href)}
                              onClick={() => setMobileOpen(false)}
                              className={`rounded-lg py-1.5 pl-2 text-sm ${
                                isLinkActive(link.href)
                                  ? "text-[#F9B214]"
                                  : "text-white/80 hover:text-[#F9B214] active:text-white"
                              }`}
                            >
                              {link.label}
                            </NavLinkIndicator>
                          </li>
                        ))}
                        {item.items?.map((link) => (
                          <li key={link.href}>
                            <NavLinkIndicator
                              href={link.href}
                              active={isLinkActive(link.href)}
                              onClick={() => setMobileOpen(false)}
                              className={`rounded-lg py-1.5 pl-2 text-sm ${
                                isLinkActive(link.href)
                                  ? "text-[#F9B214]"
                                  : "text-white/80 hover:text-[#F9B214] active:text-white"
                              }`}
                            >
                              {link.label}
                            </NavLinkIndicator>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              ))}
              {session ? (
                <NavbarUserSection
                  session={session}
                  layout="stacked"
                  onNavigate={() => setMobileOpen(false)}
                />
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="font-montserrat mt-4 flex w-full items-center justify-center rounded-full bg-[#DB2B2C] py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-[#F9B214] hover:text-[#083148] active:scale-[0.98]"
                >
                  Iniciar sesión
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
