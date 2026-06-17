"use client";

import { SiteContainer } from "@/components/site/site-container";
import {
  getTextRevealMotion,
  useSectionScrollReveal,
} from "@/hooks/use-section-scroll-reveal";
import { modeloEducativoIntro } from "@/lib/site/nosotros";

export function ModeloIntroSection() {
  const { sectionRef, progress, isMobile } = useSectionScrollReveal();
  const motion = getTextRevealMotion(progress, isMobile);

  return (
    <section ref={sectionRef} className="bg-white py-14 sm:py-16">
      <SiteContainer>
        <div
          className="mx-auto max-w-3xl text-center will-change-transform"
          style={{ transform: motion.transform, opacity: motion.opacity }}
        >
          <p className="font-montserrat text-xs font-bold uppercase tracking-[0.25em] text-[#F9B214]">
            {modeloEducativoIntro.eyebrow}
          </p>
          <h2 className="font-bebas mt-4 text-3xl uppercase leading-tight tracking-wide text-[#083148] sm:text-4xl lg:text-5xl">
            {modeloEducativoIntro.title}
          </h2>
          <p className="font-montserrat mt-5 text-base leading-relaxed text-[#083148]/70 sm:text-lg">
            {modeloEducativoIntro.description}
          </p>
        </div>
      </SiteContainer>
    </section>
  );
}
