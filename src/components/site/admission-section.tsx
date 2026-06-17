"use client";

import { AdmissionCtaCard } from "@/components/site/admission-cta-card";
import { AdmissionStepper } from "@/components/site/admission-stepper";
import { SiteContainer } from "@/components/site/site-container";
import {
  getContentRevealMotion,
  getTextRevealMotion,
  useSectionScrollReveal,
} from "@/hooks/use-section-scroll-reveal";
import { admissionContent } from "@/lib/site/admission";

export function AdmissionSection() {
  const { sectionRef, progress, isMobile } = useSectionScrollReveal();
  const headerMotion = getTextRevealMotion(progress, isMobile);
  const processMotion = getContentRevealMotion(progress, isMobile);
  const ctaMotion = getContentRevealMotion(progress, isMobile);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#ebebed] py-16 sm:py-20 lg:py-24"
    >
      <SiteContainer>
        <div className="grid gap-5 lg:grid-cols-[1.65fr_1fr] lg:items-stretch lg:gap-6">
          <div
            className="rounded-sm border-2 border-[#083148]/15 bg-white p-6 shadow-[0_14px_40px_rgba(8,49,72,0.12)] will-change-transform sm:p-8 lg:p-10"
            style={{
              transform: processMotion.transform,
            }}
          >
            <header
              className="will-change-transform"
              style={{
                transform: headerMotion.transform,
              }}
            >
              <span className="font-montserrat inline-block bg-[#083148] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-[#F9B214] sm:text-xs">
                {admissionContent.label}
              </span>
              <h2 className="font-bebas mt-5 max-w-3xl text-5xl uppercase leading-[0.92] tracking-wide text-[#083148] sm:text-6xl lg:text-7xl">
                {admissionContent.title}
              </h2>
            </header>

            <AdmissionStepper steps={admissionContent.steps} />
          </div>

          <div
            className="will-change-transform lg:translate-y-0"
            style={{
              transform: ctaMotion.transform,
            }}
          >
            <AdmissionCtaCard cta={admissionContent.cta} />
          </div>
        </div>
      </SiteContainer>
    </section>
  );
}
