"use client";

import { EcosystemCardComponent } from "@/components/site/ecosystem-card";
import type { EcosystemCard } from "@/lib/site/ecosystem";
import { useState } from "react";

interface EcosystemCardsPanelProps {
  cards: EcosystemCard[];
}

function getCardLayoutClass(
  cardId: string,
  hoveredId: string | null,
  expandedId: string | null,
) {
  if (expandedId) {
    return expandedId === cardId
      ? "flex-1 opacity-100"
      : "max-h-0 max-w-0 flex-[0] overflow-hidden opacity-0 lg:max-h-none";
  }

  const hasHover = hoveredId !== null;
  const isActive = hoveredId === cardId;

  if (!hasHover) {
    return "flex-1 opacity-100";
  }

  return isActive ? "flex-[1.65] opacity-100" : "flex-[0.85] opacity-100";
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
    <>
      <div
        className="flex flex-col gap-4 lg:hidden"
        onMouseLeave={() => !expandedId && setHoveredId(null)}
      >
        {cards.map((card) => {
          const isHidden = expandedId !== null && expandedId !== card.id;

          return (
            <div
              key={card.id}
              className={`transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                isHidden
                  ? "pointer-events-none max-h-0 overflow-hidden opacity-0"
                  : "max-h-[2000px] opacity-100"
              }`}
              onMouseEnter={() => !expandedId && setHoveredId(card.id)}
            >
              <EcosystemCardComponent
                card={card}
                isHighlighted={!expandedId && hoveredId === card.id}
                isExpanded={expandedId === card.id}
                onCtaClick={() => handleCtaClick(card.id)}
                onClose={handleClose}
              />
            </div>
          );
        })}
      </div>

      <div
        className="hidden items-stretch gap-5 lg:flex"
        onMouseLeave={() => !expandedId && setHoveredId(null)}
      >
        {cards.map((card) => (
          <div
            key={card.id}
            className={`min-w-0 transition-[flex-grow,flex-basis,opacity,max-width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${getCardLayoutClass(
              card.id,
              hoveredId,
              expandedId,
            )} ${expandedId && expandedId !== card.id ? "pointer-events-none" : ""}`}
            onMouseEnter={() => !expandedId && setHoveredId(card.id)}
          >
            <EcosystemCardComponent
              card={card}
              isHighlighted={!expandedId && hoveredId === card.id}
              isExpanded={expandedId === card.id}
              onCtaClick={() => handleCtaClick(card.id)}
              onClose={handleClose}
            />
          </div>
        ))}
      </div>
    </>
  );
}
