"use client";

import { EcosystemCardComponent } from "@/components/site/ecosystem-card";
import type { EcosystemCard } from "@/lib/site/ecosystem";
import {
  ECOSYSTEM_BENTO_EXPANDED_CLASS,
  ECOSYSTEM_BENTO_GRID_CLASS,
  ecosystemBentoLayout,
} from "@/lib/site/ecosystem-bento";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface EcosystemCardsPanelProps {
  cards: EcosystemCard[];
}

export function EcosystemCardsPanel({ cards }: EcosystemCardsPanelProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  function handleCtaClick(cardId: string) {
    setExpandedId(cardId);
    setHoveredId(null);
  }

  function handleClose() {
    setExpandedId(null);
    setHoveredId(null);
  }

  return (
    <div
      className={ECOSYSTEM_BENTO_GRID_CLASS}
      onMouseLeave={() => !expandedId && setHoveredId(null)}
    >
      {cards.map((card) => {
        const placement = ecosystemBentoLayout[card.id];
        const isExpanded = expandedId === card.id;
        const isHidden = expandedId !== null && !isExpanded;

        return (
          <div
            key={card.id}
            className={cn(
              "flex h-full min-h-[280px] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
              isExpanded
                ? ECOSYSTEM_BENTO_EXPANDED_CLASS
                : placement?.className ?? "md:col-span-1 lg:col-span-1",
              isHidden && "pointer-events-none hidden",
            )}
            onMouseEnter={() => !expandedId && setHoveredId(card.id)}
          >
            <EcosystemCardComponent
              card={card}
              bentoSize={placement?.size ?? "wide"}
              isHighlighted={!expandedId && hoveredId === card.id}
              isExpanded={isExpanded}
              onCtaClick={() => handleCtaClick(card.id)}
              onClose={handleClose}
            />
          </div>
        );
      })}
    </div>
  );
}
