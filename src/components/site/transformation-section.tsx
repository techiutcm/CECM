"use client";

import { SiteContainer } from "@/components/site/site-container";
import {
  getContentRevealMotion,
  getTextRevealMotion,
  useSectionScrollReveal,
} from "@/hooks/use-section-scroll-reveal";
import { transformationContent } from "@/lib/site/transformation";
import Image from "next/image";

export function TransformationSection() {
  const { sectionRef, progress, isMobile } = useSectionScrollReveal();
  const headerMotion = getTextRevealMotion(progress, isMobile);
  const bodyMotion = getContentRevealMotion(progress, isMobile);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[28rem] overflow-hidden sm:min-h-[32rem] lg:min-h-[36rem]"
    >
      <div className="absolute inset-0">
        <Image
          src="/transformation-section-bg.jpg"
          alt=""
          fill
          priority={false}
          sizes="100vw"
          className="object-cover object-[center_35%] sm:object-[65%_center]"
          aria-hidden
        />

        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(105deg, #071525 0%, #0c1f3d 34%, rgba(12, 31, 61, 0.88) 48%, rgba(18, 24, 58, 0.45) 62%, rgba(18, 24, 58, 0.12) 78%, transparent 100%)",
          }}
        />

        <div
          className="absolute inset-0 bg-gradient-to-r from-[#1a1040]/35 via-transparent to-transparent"
          aria-hidden
        />

        <div className="absolute inset-0 bg-[#071525]/55 sm:bg-transparent" aria-hidden />
      </div>

      <SiteContainer className="relative z-10 flex h-full min-h-[inherit] items-center py-16 sm:py-20 lg:py-24">
        <div className="max-w-xl lg:max-w-2xl">
          <header
            className="will-change-transform"
            style={{
              transform: headerMotion.transform,
            }}
          >
            <p className="font-montserrat text-[11px] font-bold uppercase tracking-[0.28em] text-[#6ec8ff] sm:text-xs">
              {transformationContent.label}
            </p>

            <h2 className="font-bebas mt-5 text-4xl uppercase leading-[0.95] tracking-wide text-white sm:mt-6 sm:text-5xl lg:text-6xl xl:text-7xl">
              {transformationContent.title}{" "}
              <span className="text-[#3dd8ff]">{transformationContent.highlight}</span>
              {transformationContent.titleSuffix}
            </h2>
          </header>

          <p
            className="font-montserrat mt-6 max-w-lg text-base leading-relaxed text-white/92 sm:mt-7 sm:text-lg lg:text-xl"
            style={{
              transform: bodyMotion.transform,
            }}
          >
            {transformationContent.description}
          </p>
        </div>
      </SiteContainer>
    </section>
  );
}
