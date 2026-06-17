"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface StagesBackgroundProps {
  scrollProgress?: number;
  static?: boolean;
}

export function StagesBackground({
  scrollProgress = 0,
  static: isStatic = false,
}: StagesBackgroundProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(isStatic);

  useEffect(() => {
    if (isStatic) return;

    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [isStatic]);

  const progress = isStatic ? 1 : scrollProgress;
  const gradientOffset = isStatic ? 0 : progress * -90;
  const logoOffsetY = isStatic ? 0 : progress * -140;
  const logoOffsetX = isStatic ? 0 : (1 - progress) * 48;
  const logoScale = isStatic ? 1 : 0.88 + progress * 0.12;
  const gradientTransform = isStatic
    ? "scale(1.08)"
    : `translate3d(0, ${gradientOffset}px, 0) scale(1.05)`;
  const revealOpacity = revealed ? 0.4 : 0;
  const logoOpacity = revealOpacity * Math.min(1, progress * 1.2 + 0.15);

  return (
    <div ref={sectionRef} className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0 z-0 will-change-transform"
        style={{
          transform: gradientTransform,
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 90% 80% at 78% 45%, rgba(249,178,20,0.28) 0%, transparent 50%),
              radial-gradient(ellipse 70% 90% at 55% 50%, rgba(219,43,44,0.32) 0%, transparent 55%),
              radial-gradient(ellipse 120% 100% at 30% 50%, rgba(8,49,72,0.88) 0%, rgba(8,49,72,0.95) 70%)
            `,
          }}
        />
      </div>

      <div
        className={`absolute inset-y-0 right-[5%] z-[5] flex items-stretch will-change-transform sm:right-[8%] lg:right-[12%] ${
          revealed ? "" : "opacity-0"
        }`}
        style={{
          transform: `translate3d(${logoOffsetX}px, ${logoOffsetY}px, 0) scale(${logoScale})`,
          opacity: logoOpacity,
          transition: revealed ? "opacity 1.4s ease-out" : "none",
        }}
      >
        <Image
          src="/logo-navbar.png"
          alt=""
          aria-hidden
          width={560}
          height={560}
          className="h-full w-auto max-w-none object-contain object-right drop-shadow-[0_8px_40px_rgba(0,0,0,0.35)]"
        />
      </div>
    </div>
  );
}
