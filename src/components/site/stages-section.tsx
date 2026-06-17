"use client";

import { StagesBackground } from "@/components/site/stages-background";
import { StagesStats } from "@/components/site/stages-stats";
import { SiteContainer } from "@/components/site/site-container";
import {
  getContentRevealMotion,
  getTextRevealMotion,
  useSectionScrollReveal,
} from "@/hooks/use-section-scroll-reveal";

export function StagesSection() {
  const { sectionRef, progress, isMobile } = useSectionScrollReveal();
  const textMotion = getTextRevealMotion(progress, isMobile);
  const statsMotion = getContentRevealMotion(progress, isMobile);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden pt-16 pb-28 sm:pt-20 sm:pb-20 lg:pt-24 lg:pb-24"
    >
      <StagesBackground scrollProgress={progress} />

      <SiteContainer className="relative z-10">
        <div
          className="max-w-3xl will-change-transform"
          style={{
            transform: textMotion.transform,
            opacity: textMotion.opacity,
          }}
        >
          <p className="font-montserrat mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#F9B214]">
            Una Visión de Futuro
          </p>
          <h2 className="font-bebas text-4xl uppercase leading-[0.95] tracking-wide text-white drop-shadow-sm sm:text-5xl lg:text-6xl">
            No añadimos horas de clase, transformamos el aprendizaje.
          </h2>
          <p className="font-montserrat mt-6 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
            Fusionamos los contenidos exigidos por el MPPE con las herramientas
            tecnológicas más demandadas del mundo para que nuestros estudiantes
            resuelvan problemas reales del contexto regional y nacional desde
            el colegio.
          </p>
        </div>

        <div
          className="will-change-transform pb-2 sm:pb-0"
          style={{
            transform: statsMotion.transform,
            opacity: statsMotion.opacity,
          }}
        >
          <StagesStats />
        </div>
      </SiteContainer>
    </section>
  );
}
