"use client";

import { PillarCard } from "@/components/site/pillar-card";
import { PillarsCircuitBackground } from "@/components/site/pillars-circuit-background";
import { SiteContainer } from "@/components/site/site-container";
import {
  getContentRevealMotion,
  getTextRevealMotion,
  useSectionScrollReveal,
} from "@/hooks/use-section-scroll-reveal";
import { pillars } from "@/lib/site/pillars";

export function PillarsSection() {
  const { sectionRef, progress, isMobile } = useSectionScrollReveal();
  const headerMotion = getTextRevealMotion(progress, isMobile);
  const cardsMotion = getContentRevealMotion(progress, isMobile);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#ebebed] pt-20 pb-16 sm:py-20 lg:py-24"
    >
      <PillarsCircuitBackground scrollProgress={progress} />

      <SiteContainer className="relative z-10">
        <header
          className="mx-auto max-w-3xl text-center will-change-transform"
          style={{
            transform: headerMotion.transform,
            opacity: headerMotion.opacity,
          }}
        >
          <p className="font-montserrat text-xs font-bold uppercase tracking-[0.25em] text-[#F9B214]">
            Nuestros Pilares
          </p>
          <h2 className="font-bebas mt-4 text-4xl uppercase leading-[0.95] tracking-wide text-[#083148] sm:text-5xl lg:text-6xl">
            Cuatro pilares que construyen el futuro
          </h2>
          <div className="mx-auto mt-5 h-1 w-16 rounded-full bg-[#F9B214] shadow-[0_0_12px_rgba(249,178,20,0.55)]" />
        </header>

        <div
          className="mt-12 will-change-transform pb-2 sm:pb-0"
          style={{
            transform: cardsMotion.transform,
            opacity: cardsMotion.opacity,
          }}
        >
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
            {pillars.map((pillar) => (
              <PillarCard key={pillar.id} pillar={pillar} />
            ))}
          </div>
        </div>
      </SiteContainer>
    </section>
  );
}
