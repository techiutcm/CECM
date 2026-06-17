"use client";

import { useEffect, useRef, useState } from "react";

export function getSectionProgress(section: HTMLElement): number {
  const rect = section.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  const start = viewportHeight * 0.92;
  const end = -rect.height * 0.35;
  const range = start - end;

  if (range <= 0) return 0;

  return Math.max(0, Math.min(1, (start - rect.top) / range));
}

interface RevealMotion {
  transform: string;
  opacity: number;
}

export function getTextRevealMotion(
  progress: number,
  isMobile: boolean,
): RevealMotion {
  const offset = (1 - progress) * (isMobile ? 24 : 56);

  return {
    transform: `translate3d(0, ${offset}px, 0)`,
    opacity: Math.min(1, progress * 1.35),
  };
}

export function getContentRevealMotion(
  progress: number,
  isMobile: boolean,
): RevealMotion {
  const offset = (1 - progress) * (isMobile ? 32 : 72);

  return {
    transform: `translate3d(0, ${offset}px, 0)`,
    opacity: Math.min(1, Math.max(0, (progress - 0.08) * 1.5)),
  };
}

export function getNavbarRevealMotion(
  progress: number,
  isMobile: boolean,
): RevealMotion {
  const offset = (1 - progress) * (isMobile ? -20 : -40);

  return {
    transform: `translate3d(0, ${offset}px, 0)`,
    opacity: Math.min(1, progress * 1.4),
  };
}

export function getHeroBackgroundMotion(scrollProgress: number): RevealMotion {
  return {
    transform: `translate3d(0, ${scrollProgress * -80}px, 0) scale(1.06)`,
    opacity: 1,
  };
}

export function getInfrastructureImageMotion(scrollProgress: number): RevealMotion {
  const y = scrollProgress * -65;
  const x = (scrollProgress - 0.5) * 16;
  const scale = 1.12 + scrollProgress * 0.05;

  return {
    transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`,
    opacity: 1,
  };
}

export function getStaggeredRevealMotion(
  progress: number,
  isMobile: boolean,
  index: number,
  staggerStep = 0.07,
): RevealMotion {
  const adjustedProgress = Math.max(
    0,
    Math.min(1, (progress - index * staggerStep) / (1 - staggerStep * 2)),
  );
  const offset = (1 - adjustedProgress) * (isMobile ? 28 : 48);

  return {
    transform: `translate3d(0, ${offset}px, 0)`,
    opacity: Math.min(1, Math.max(0, (adjustedProgress - 0.04) * 1.45)),
  };
}

export function useSectionScrollReveal() {
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const targetProgress = useRef(0);
  const smoothProgress = useRef(0);
  const frameRef = useRef(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const mobileQuery = window.matchMedia("(max-width: 639px)");

    function updateTarget() {
      targetProgress.current = getSectionProgress(section!);
      setIsMobile(mobileQuery.matches);
    }

    function animate() {
      const delta = targetProgress.current - smoothProgress.current;
      smoothProgress.current += delta * 0.1;

      if (Math.abs(delta) > 0.0005) {
        setProgress(smoothProgress.current);
      }

      frameRef.current = window.requestAnimationFrame(animate);
    }

    updateTarget();
    frameRef.current = window.requestAnimationFrame(animate);

    window.addEventListener("scroll", updateTarget, { passive: true });
    window.addEventListener("resize", updateTarget);
    mobileQuery.addEventListener("change", updateTarget);

    return () => {
      window.cancelAnimationFrame(frameRef.current);
      window.removeEventListener("scroll", updateTarget);
      window.removeEventListener("resize", updateTarget);
      mobileQuery.removeEventListener("change", updateTarget);
    };
  }, []);

  return { sectionRef, progress, isMobile };
}
