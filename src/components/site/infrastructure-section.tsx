"use client";

import { InfrastructureBackground } from "@/components/site/infrastructure-background";
import { InfrastructureCardComponent } from "@/components/site/infrastructure-card";
import { SiteContainer } from "@/components/site/site-container";
import {
  getStaggeredRevealMotion,
  getTextRevealMotion,
  useSectionScrollReveal,
} from "@/hooks/use-section-scroll-reveal";
import { infrastructureCards } from "@/lib/site/infrastructure";

export function InfrastructureSection() {
  const { sectionRef, progress, isMobile } = useSectionScrollReveal();
  const headerMotion = getTextRevealMotion(progress, isMobile);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#083148] py-16 sm:py-20 lg:py-24"
    >
      <InfrastructureBackground scrollProgress={progress} />

      <SiteContainer className="relative z-10">
        <header
          className="mx-auto max-w-4xl text-center will-change-transform"
          style={{
            transform: headerMotion.transform,
            opacity: headerMotion.opacity,
          }}
        >
          <p className="font-montserrat text-xs font-bold uppercase tracking-[0.25em] text-[#F9B214]">
            Infraestructura de Resiliencia
          </p>
          <h2 className="font-bebas mt-4 text-4xl uppercase leading-[0.95] tracking-wide text-[#F9B214] sm:text-5xl lg:text-6xl">
            Innovación que nunca se detiene.
          </h2>
          <p className="font-bebas mt-2 text-3xl uppercase leading-[0.95] tracking-wide text-[#F9B214] sm:text-4xl lg:text-5xl">
            Educación sin interrupciones.
          </p>
        </header>

        <div className="mt-12 grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.65fr)] lg:gap-6">
          {infrastructureCards.map((card, index) => {
            const cardMotion = getStaggeredRevealMotion(progress, isMobile, index);

            return (
              <div
                key={card.id}
                className="will-change-transform"
                style={{
                  transform: cardMotion.transform,
                  opacity: cardMotion.opacity,
                }}
              >
                <InfrastructureCardComponent card={card} />
              </div>
            );
          })}
        </div>
      </SiteContainer>
    </section>
  );
}
