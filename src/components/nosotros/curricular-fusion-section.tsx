"use client";

import { SiteContainer } from "@/components/site/site-container";
import {
  getContentRevealMotion,
  getTextRevealMotion,
  useSectionScrollReveal,
} from "@/hooks/use-section-scroll-reveal";
import {
  curricularFusionContent,
  type CurricularArea,
} from "@/lib/site/nosotros";
import { techEcosystemGridStyle } from "@/lib/site/section-styles";
import {
  BookOpen,
  Microscope,
  PencilRuler,
  Sparkles,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const areaIcons: Record<CurricularArea["icon"], LucideIcon> = {
  microscope: Microscope,
  math: PencilRuler,
  books: BookOpen,
  group: Users,
};

function CurricularAreaCard({ area }: { area: CurricularArea }) {
  const Icon = areaIcons[area.icon];

  return (
    <article className="rounded-2xl border border-[#0A2533]/10 bg-white p-5 shadow-lg shadow-[#0A2533]/8 sm:p-6">
      <div
        className="flex h-11 w-11 items-center justify-center rounded-xl"
        style={{ backgroundColor: area.iconBg }}
      >
        <Icon
          className="h-5 w-5"
          style={{ color: area.iconColor }}
          strokeWidth={2}
          aria-hidden
        />
      </div>
      <h3 className="font-montserrat mt-4 text-sm font-bold uppercase tracking-wide text-[#0A2533] sm:text-[0.9375rem]">
        {area.title}
      </h3>
      <p className="font-montserrat mt-2 text-sm leading-relaxed text-[#0A2533]/70">
        {area.description}
      </p>
    </article>
  );
}

export function CurricularFusionSection() {
  const { sectionRef, progress, isMobile } = useSectionScrollReveal();
  const headerMotion = getTextRevealMotion(progress, isMobile);
  const cardsMotion = getContentRevealMotion(progress, isMobile);
  const { areas, highlights } = curricularFusionContent;

  const leftColumnAreas = [areas[0], areas[2]];
  const rightColumnAreas = [areas[1], areas[3]];

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-16 sm:py-20 lg:py-24"
      style={techEcosystemGridStyle}
    >
      <SiteContainer>
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-14 xl:gap-16">
          <div
            className="will-change-transform"
            style={{
              transform: headerMotion.transform,
              opacity: headerMotion.opacity,
            }}
          >
            <span className="font-montserrat inline-flex items-center gap-2 rounded-full border border-[#0A2533]/15 bg-white/70 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#0A2533] backdrop-blur-sm sm:text-xs">
              <Sparkles className="h-3.5 w-3.5 text-[#0A2533]" aria-hidden />
              {curricularFusionContent.eyebrow}
            </span>

            <h2 className="font-bebas mt-5 text-4xl uppercase leading-[0.92] tracking-wide text-[#0A2533] sm:text-5xl lg:text-6xl">
              Fusión de Contenidos
            </h2>

            <p className="font-montserrat mt-5 text-base font-semibold leading-relaxed text-[#0A2533] sm:text-lg">
              {curricularFusionContent.lead}
            </p>
            <p className="font-montserrat mt-3 text-base leading-relaxed text-[#0A2533]/75 sm:text-lg">
              {curricularFusionContent.description}
            </p>

            <ul className="mt-8 space-y-4">
              {highlights.map((item) => (
                <li key={item.id}>
                  <p className="font-montserrat text-sm font-bold text-[#0A2533]">
                    {item.title}
                  </p>
                  <p className="font-montserrat mt-1 text-sm leading-relaxed text-[#0A2533]/65">
                    {item.description}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div
            className="will-change-transform"
            style={{
              transform: cardsMotion.transform,
              opacity: cardsMotion.opacity,
            }}
          >
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
              <div className="flex flex-col gap-5 sm:gap-6">
                {leftColumnAreas.map((area) => (
                  <CurricularAreaCard key={area.id} area={area} />
                ))}
              </div>
              <div className="flex flex-col gap-5 sm:mt-12 sm:gap-6">
                {rightColumnAreas.map((area) => (
                  <CurricularAreaCard key={area.id} area={area} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </SiteContainer>
    </section>
  );
}
