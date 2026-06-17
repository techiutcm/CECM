"use client";

import { useEffect, useRef, useState } from "react";

interface AnimatedStatCounterProps {
  startValue: number;
  endValue: number;
  prefix?: string;
  suffix?: string;
  padLength?: number;
  duration?: number;
  className?: string;
  ariaLabel?: string;
}

function formatStatValue(
  value: number,
  prefix: string,
  suffix: string,
  padLength?: number,
) {
  const shouldPad = padLength !== undefined && value < 10 ** padLength;
  const formattedNumber = shouldPad
    ? String(value).padStart(padLength, "0")
    : String(value);

  return `${prefix}${formattedNumber}${suffix}`;
}

export function AnimatedStatCounter({
  startValue,
  endValue,
  prefix = "",
  suffix = "",
  padLength,
  duration = 2200,
  className = "",
  ariaLabel,
}: AnimatedStatCounterProps) {
  const counterRef = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(startValue);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    const element = counterRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasAnimatedRef.current) return;

        hasAnimatedRef.current = true;
        const startTime = performance.now();

        function animate(now: number) {
          const progress = Math.min(1, (now - startTime) / duration);
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = Math.round(
            startValue + (endValue - startValue) * eased,
          );

          setValue(current);

          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        }

        requestAnimationFrame(animate);
      },
      { threshold: 0.35, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [duration, endValue, startValue]);

  return (
    <span
      ref={counterRef}
      className={className}
      aria-label={
        ariaLabel ?? `${formatStatValue(endValue, prefix, suffix, padLength)}`
      }
    >
      {formatStatValue(value, prefix, suffix, padLength)}
    </span>
  );
}
