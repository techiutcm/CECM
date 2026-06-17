"use client";

import { StageIcon } from "@/components/site/stage-icon";
import type { StageCard } from "@/lib/site/stages";
import Link from "next/link";
import { useState } from "react";

interface FlipCardProps {
  card: StageCard;
}

export function FlipCard({ card }: FlipCardProps) {
  const [flipped, setFlipped] = useState(false);
  const isLightBack = card.backColor === "#F9B214";
  const textColor = isLightBack ? "text-[#083148]" : "text-white";
  const ctaClass = isLightBack
    ? "bg-[#083148] text-white hover:bg-[#0a4466]"
    : "bg-white text-[#083148] hover:bg-white/90";

  return (
    <div
      className="group h-[380px] w-full cursor-pointer [perspective:1200px] sm:h-[420px] lg:h-[460px]"
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      onClick={() => setFlipped((prev) => !prev)}
      onKeyDown={(e) => e.key === "Enter" && setFlipped((prev) => !prev)}
      role="button"
      tabIndex={0}
      aria-label={`${card.title}. Pasa el cursor o toca para ver más.`}
    >
      <div
        className={`relative h-full w-full transition-transform duration-700 [transform-style:preserve-3d] ${flipped ? "[transform:rotateY(180deg)]" : ""} group-hover:[transform:rotateY(180deg)]`}
      >
        {/* Frente */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl [backface-visibility:hidden]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={card.image}
            alt=""
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 flex flex-col items-center px-6 pb-8 pt-16 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-sm">
              <StageIcon type={card.icon} className="h-6 w-6" />
            </div>
            <h3 className="font-bebas text-xl uppercase tracking-wide text-white sm:text-2xl">
              {card.title}
            </h3>
          </div>
        </div>

        {/* Reverso */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl px-6 py-8 text-center [backface-visibility:hidden] [transform:rotateY(180deg)] sm:px-8"
          style={{ backgroundColor: card.backColor }}
        >
          <div
            className={`mb-4 flex h-12 w-12 items-center justify-center rounded-full border ${isLightBack ? "border-[#083148]/20 bg-[#083148]/10 text-[#083148]" : "border-white/30 bg-white/10 text-white"}`}
          >
            <StageIcon type={card.icon} className="h-6 w-6" />
          </div>
          <p className={`font-montserrat max-w-[220px] text-sm leading-relaxed sm:text-base ${textColor} ${isLightBack ? "" : "text-white/90"}`}>
            {card.backText}
          </p>
          <Link
            href={card.ctaHref}
            className={`font-montserrat mt-8 inline-flex rounded-full px-6 py-2.5 text-xs font-bold uppercase tracking-wide transition ${ctaClass}`}
          >
            {card.ctaLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}
