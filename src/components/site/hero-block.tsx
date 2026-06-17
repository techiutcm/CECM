"use client";

import { HeroSection } from "@/components/site/hero-section";
import { Navbar } from "@/components/site/navbar";
import type { NavbarSession } from "@/lib/auth/navbar-session";
import { useSectionScrollReveal } from "@/hooks/use-section-scroll-reveal";

interface HeroBlockProps {
  session?: NavbarSession | null;
}

export function HeroBlock({ session = null }: HeroBlockProps) {
  const { sectionRef, progress, isMobile } = useSectionScrollReveal();

  return (
    <div
      ref={sectionRef}
      className="relative mx-auto max-w-[1440px] overflow-hidden rounded-[2rem] shadow-2xl shadow-black/20 sm:rounded-[2.5rem]"
    >
      <HeroSection scrollProgress={progress} isMobile={isMobile} />
      <Navbar scrollProgress={progress} isMobile={isMobile} session={session} />
    </div>
  );
}
