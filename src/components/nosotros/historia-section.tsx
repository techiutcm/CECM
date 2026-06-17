"use client";

import { SiteContainer } from "@/components/site/site-container";
import {
  getContentRevealMotion,
  getTextRevealMotion,
  useSectionScrollReveal,
} from "@/hooks/use-section-scroll-reveal";
import { historiaIntro, historiaMilestones, sedes } from "@/lib/site/nosotros";
import { MapPin, School } from "lucide-react";

export function HistoriaSection() {
  const { sectionRef, progress, isMobile } = useSectionScrollReveal();
  const headerMotion = getTextRevealMotion(progress, isMobile);

  return (
    <section ref={sectionRef} className="bg-[#ebebed] py-16 sm:py-20 lg:py-24">
      <SiteContainer>
        <header
          className="mx-auto max-w-3xl text-center will-change-transform"
          style={{ transform: headerMotion.transform, opacity: headerMotion.opacity }}
        >
          <p className="font-montserrat text-xs font-bold uppercase tracking-[0.25em] text-[#F9B214]">
            {historiaIntro.eyebrow}
          </p>
          <h2 className="font-bebas mt-4 text-4xl uppercase tracking-wide text-[#083148] sm:text-5xl">
            {historiaIntro.title}
          </h2>
          <p className="font-montserrat mx-auto mt-5 max-w-2xl text-base leading-relaxed text-[#083148]/75 sm:text-lg">
            {historiaIntro.description}
          </p>
        </header>

        <div className="relative mx-auto mt-14 max-w-4xl">
          <div className="absolute bottom-0 left-4 top-0 w-px bg-[#083148]/15 sm:left-1/2 sm:-translate-x-px" />
          <div className="space-y-12 sm:space-y-14">
            {historiaMilestones.map((item, index) => {
              const motion = getContentRevealMotion(progress, isMobile);
              const isEven = index % 2 === 0;

              return (
                <div
                  key={item.title}
                  className="relative grid gap-5 sm:grid-cols-2 sm:gap-10"
                  style={{ transform: motion.transform, opacity: motion.opacity }}
                >
                  <div className={isEven ? "sm:text-right" : "sm:col-start-2"}>
                    <span
                      className={`font-bebas uppercase leading-tight text-[#F9B214] ${
                        item.year.length > 4
                          ? "text-2xl sm:text-3xl"
                          : "text-4xl sm:text-5xl"
                      }`}
                    >
                      {item.year}
                    </span>
                    <h3 className="font-montserrat mt-2 text-xl font-bold text-[#083148] sm:text-2xl">
                      {item.title}
                    </h3>
                    <p className="font-montserrat mt-3 text-base leading-relaxed text-[#083148]/75 sm:text-lg">
                      {item.description}
                    </p>
                  </div>
                  <span className="absolute left-4 top-1.5 h-3.5 w-3.5 -translate-x-1/2 rounded-full border-2 border-[#F9B214] bg-white sm:left-1/2" />
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-20">
          <h3 className="font-bebas text-center text-3xl uppercase tracking-wide text-[#083148] sm:text-4xl">
            Nuestras Sedes
          </h3>
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {sedes.map((sede, index) => {
              const motion = getContentRevealMotion(progress, isMobile);

              return (
                <article
                  key={sede.id}
                  className="rounded-2xl border border-[#083148]/10 bg-white p-6 shadow-sm"
                  style={{
                    transform: motion.transform,
                    opacity: motion.opacity,
                    transitionDelay: `${index * 80}ms`,
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div className="rounded-xl bg-[#083148]/8 p-3">
                      <School className="h-6 w-6 text-[#083148]" />
                    </div>
                    <div>
                      <h4 className="font-montserrat text-lg font-bold text-[#083148]">
                        {sede.name}
                      </h4>
                      <p className="font-montserrat mt-1 flex items-center gap-1.5 text-sm text-[#083148]/60">
                        <MapPin className="h-3.5 w-3.5" />
                        {sede.location}
                      </p>
                      <p className="font-montserrat mt-2 text-xs font-semibold uppercase tracking-wide text-[#F9B214]">
                        {sede.levels}
                      </p>
                      <p className="font-montserrat mt-3 text-sm leading-relaxed text-[#083148]/70">
                        {sede.description}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </SiteContainer>
    </section>
  );
}
