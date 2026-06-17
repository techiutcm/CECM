"use client";

import { getInfrastructureImageMotion } from "@/hooks/use-section-scroll-reveal";
import Image from "next/image";

interface InfrastructureBackgroundProps {
  scrollProgress?: number;
}

export function InfrastructureBackground({
  scrollProgress = 0,
}: InfrastructureBackgroundProps) {
  const imageMotion = getInfrastructureImageMotion(scrollProgress);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div
        className="absolute -bottom-[28%] -left-[15%] -right-[15%] -top-[20%] z-0 will-change-transform"
        style={{
          transform: imageMotion.transform,
        }}
      >
        <div className="relative h-full w-full">
          <Image
            src="/vr.png"
            alt=""
            fill
            priority={false}
            className="object-cover object-center"
            sizes="100vw"
          />
        </div>
      </div>

      <div
        className="absolute inset-0 z-[1]"
        style={{
          background: `
            radial-gradient(ellipse 110% 90% at 15% 45%, rgba(8,49,72,0.82) 0%, rgba(8,49,72,0.48) 48%, transparent 74%),
            radial-gradient(ellipse 75% 80% at 88% 55%, rgba(219,43,44,0.42) 0%, rgba(219,43,44,0.16) 42%, transparent 70%),
            linear-gradient(125deg, rgba(8,49,72,0.72) 0%, rgba(8,49,72,0.48) 45%, rgba(219,43,44,0.28) 100%),
            linear-gradient(to bottom, transparent 0%, rgba(8,49,72,0.35) 78%, rgba(8,49,72,0.92) 100%)
          `,
        }}
      />
    </div>
  );
}
