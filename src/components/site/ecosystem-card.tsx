"use client";

import { EcosystemCardExpanded } from "@/components/site/ecosystem-card-expanded";
import type { EcosystemCard } from "@/lib/site/ecosystem";

interface EcosystemCardProps {
  card: EcosystemCard;
  isHighlighted?: boolean;
  isExpanded?: boolean;
  onCtaClick?: () => void;
  onClose?: () => void;
}

export function EcosystemCardComponent({
  card,
  isHighlighted = false,
  isExpanded = false,
  onCtaClick,
  onClose,
}: EcosystemCardProps) {
  return (
    <article
      className={`flex h-full min-h-[320px] flex-col transition-[background-color,border-color] duration-500 sm:min-h-[360px] ${
        isExpanded ? "p-4 sm:p-6 lg:p-8" : "p-6 sm:p-8"
      } ${
        isExpanded
          ? "border border-[#0A2533] bg-transparent"
          : isHighlighted
            ? "bg-[#0A2533]"
            : "border border-[#0A2533] bg-transparent"
      }`}
    >
      {isExpanded && card.expanded && onClose ? (
        <EcosystemCardExpanded content={card.expanded} onClose={onClose} />
      ) : (
        <>
          <h3
            className={`font-bebas max-w-md text-3xl uppercase leading-[0.95] tracking-wide sm:text-4xl lg:text-5xl ${
              isHighlighted ? "text-[#F5B025]" : "text-[#0A2533]"
            }`}
          >
            {card.title}
          </h3>

          <p
            className={`font-montserrat mt-4 max-w-lg flex-1 text-base leading-relaxed sm:text-lg ${
              isHighlighted ? "text-[#F5B025]/90" : "text-[#0A2533]/85"
            }`}
          >
            {card.description}
          </p>

          {card.cta && card.expanded && (
            <button
              type="button"
              onClick={onCtaClick}
              className={`font-montserrat mt-8 inline-flex w-fit items-center gap-2 px-6 py-3.5 text-sm font-bold uppercase tracking-[0.15em] transition sm:px-7 sm:py-4 sm:text-base ${
                isHighlighted
                  ? "bg-[#F5B025] text-[#0A2533] hover:bg-white"
                  : "bg-[#0A2533] text-[#F5B025] hover:bg-[#0d3045]"
              }`}
            >
              {card.cta.label}
              <span aria-hidden>→</span>
            </button>
          )}
        </>
      )}
    </article>
  );
}
