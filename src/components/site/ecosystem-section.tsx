"use client";

import { EcosystemCardsPanel } from "@/components/site/ecosystem-cards-panel";
import { SiteContainer } from "@/components/site/site-container";
import {
  getContentRevealMotion,
  getStaggeredRevealMotion,
  getTextRevealMotion,
  useSectionScrollReveal,
} from "@/hooks/use-section-scroll-reveal";
import { techEcosystemGridStyle } from "@/lib/site/section-styles";
import { ecosystemContent } from "@/lib/site/ecosystem";

export function EcosystemSection() {
  const { sectionRef, progress, isMobile } = useSectionScrollReveal();
  const headerMotion = getTextRevealMotion(progress, isMobile);
  const dividerMotion = getContentRevealMotion(progress, isMobile);

  const cardsMotion = getStaggeredRevealMotion(progress, isMobile, 0);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-16 sm:py-20 lg:py-24"
      style={techEcosystemGridStyle}
    >
      <SiteContainer>
        <header
          className="will-change-transform"
          style={{
            transform: headerMotion.transform,
            opacity: headerMotion.opacity,
          }}
        >
          <span className="font-montserrat inline-block bg-[#0A2533] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-[#F5B025] sm:text-xs">
            {ecosystemContent.label}
          </span>
          <h2 className="font-bebas mt-5 max-w-5xl text-4xl uppercase leading-[0.92] tracking-wide text-[#0A2533] sm:text-5xl lg:text-6xl xl:text-7xl">
            {ecosystemContent.title}
          </h2>
        </header>

        <div
          className="mt-8 h-px w-full bg-[#0A2533] will-change-transform sm:mt-10"
          style={{
            transform: dividerMotion.transform,
            opacity: dividerMotion.opacity,
          }}
        />

        <div
          className="mt-8 will-change-transform"
          style={{
            transform: cardsMotion.transform,
            opacity: cardsMotion.opacity,
          }}
        >
          <EcosystemCardsPanel cards={ecosystemContent.cards} />
        </div>
      </SiteContainer>
    </section>
  );
}
