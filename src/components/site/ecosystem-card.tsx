"use client";

import { EcosystemCardExpanded } from "@/components/site/ecosystem-card-expanded";
import type { EcosystemCard } from "@/lib/site/ecosystem";
import type { EcosystemBentoSize } from "@/lib/site/ecosystem-bento";
import { getEcosystemCardTheme } from "@/lib/site/ecosystem-card-theme";
import { cn } from "@/lib/utils";

interface EcosystemCardProps {
  card: EcosystemCard;
  bentoSize?: EcosystemBentoSize;
  isHighlighted?: boolean;
  isExpanded?: boolean;
  onCtaClick?: () => void;
  onClose?: () => void;
}

const titleClasses: Record<EcosystemBentoSize, string> = {
  featured: "text-3xl sm:text-4xl lg:text-5xl xl:text-[3.25rem]",
  wide: "text-3xl sm:text-4xl lg:text-[2.35rem]",
  compact: "text-2xl sm:text-3xl lg:text-[1.85rem]",
};

const bodyClasses: Record<EcosystemBentoSize, string> = {
  featured: "text-base sm:text-lg lg:text-[1.05rem] max-w-3xl",
  wide: "text-base sm:text-lg max-w-3xl",
  compact: "text-sm sm:text-base max-w-none",
};

const paddingClasses: Record<EcosystemBentoSize, string> = {
  featured: "p-6 sm:p-8 lg:p-9",
  wide: "p-6 sm:p-7 lg:p-8",
  compact: "p-5 sm:p-6 lg:p-6",
};

export function EcosystemCardComponent({
  card,
  bentoSize = "wide",
  isHighlighted = false,
  isExpanded = false,
  onCtaClick,
  onClose,
}: EcosystemCardProps) {
  const size = isExpanded ? "featured" : bentoSize;
  const theme = getEcosystemCardTheme(card.id, isHighlighted);

  return (
    <article
      className={cn(
        "flex h-full min-h-[inherit] flex-col rounded-2xl border transition-[border-color,box-shadow,transform] duration-500",
        isExpanded ? "p-4 sm:p-6 lg:p-8" : paddingClasses[size],
        isExpanded
          ? "border-[#0A2533] bg-transparent shadow-none"
          : cn(theme.borderClass, theme.shadowClass, isHighlighted && "lg:scale-[1.01]"),
      )}
      style={!isExpanded ? { backgroundColor: theme.backgroundColor } : undefined}
    >
      {isExpanded && card.expanded && onClose ? (
        <EcosystemCardExpanded content={card.expanded} onClose={onClose} />
      ) : (
        <>
          <h3
            className={cn(
              "font-bebas max-w-md uppercase leading-[0.95] tracking-wide",
              titleClasses[size],
              theme.titleClass,
            )}
          >
            {card.title}
          </h3>

          <p
            className={cn(
              "font-montserrat mt-3 flex-1 leading-relaxed sm:mt-4",
              bodyClasses[size],
              theme.bodyClass,
            )}
          >
            {card.description}
          </p>

          {card.cta && card.expanded && (
            <button
              type="button"
              onClick={onCtaClick}
              className={cn(
                "font-montserrat mt-6 inline-flex w-fit shrink-0 items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-[0.15em] transition sm:mt-8 sm:px-6 sm:py-3.5 sm:text-sm lg:mt-auto lg:pt-6",
                theme.buttonClass,
              )}
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
