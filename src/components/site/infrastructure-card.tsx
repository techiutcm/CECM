import { AnimatedStatCounter } from "@/components/site/animated-stat-counter";
import { InfrastructureIcon } from "@/components/site/infrastructure-icon";
import type { InfrastructureCard } from "@/lib/site/infrastructure";
import Image from "next/image";

interface InfrastructureCardProps {
  card: InfrastructureCard;
}

const cardShadow =
  "shadow-[0_8px_32px_rgba(8,49,72,0.1)] shadow-[0_2px_8px_rgba(8,49,72,0.04)]";

export function InfrastructureCardComponent({ card }: InfrastructureCardProps) {
  if (card.variant === "continuity") {
    return (
      <article className={`flex h-full flex-col justify-between rounded-3xl bg-[#1A2332] p-6 sm:p-8 ${cardShadow}`}>
        <div>
          <div className="flex items-center gap-2.5">
            <span
              aria-hidden
              className="inline-block h-5 w-5 shrink-0 sm:h-6 sm:w-6"
              style={{
                backgroundColor: "#2C6BC5",
                WebkitMaskImage: "url(/certified-svgrepo-com.svg)",
                maskImage: "url(/certified-svgrepo-com.svg)",
                WebkitMaskSize: "contain",
                maskSize: "contain",
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
                WebkitMaskPosition: "center",
                maskPosition: "center",
              }}
            />
            <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.2em] text-white/70 sm:text-xs">
              {card.eyebrow}
            </p>
          </div>
          <div className="mt-6 flex flex-wrap items-end gap-3 sm:gap-4">
            <AnimatedStatCounter
              startValue={1}
              endValue={99}
              suffix="%"
              padLength={2}
              duration={2200}
              className="font-bebas text-6xl leading-none text-[#3B82F6] sm:text-7xl lg:text-8xl"
              ariaLabel="99% de continuidad operativa garantizada"
            />
            <p className="font-montserrat max-w-[14rem] pb-1 text-sm font-bold uppercase leading-snug tracking-wide text-white/55 sm:text-base">
              {card.statLabel}
            </p>
          </div>
        </div>
        <p className="font-montserrat mt-6 text-sm leading-relaxed text-white/60 sm:text-[0.9375rem]">
          {card.description}
        </p>
      </article>
    );
  }

  if (card.variant === "connectivity") {
    return (
      <article className={`flex h-full flex-col overflow-hidden rounded-3xl bg-white sm:flex-row ${cardShadow}`}>
        <div className="flex flex-1 flex-col p-6 sm:p-7 lg:p-8">
          <InfrastructureIcon variant={card.variant} />
          <h3 className="font-montserrat mt-4 text-lg font-bold uppercase tracking-wide text-[#083148] sm:text-xl">
            {card.title}
          </h3>
          <p className="font-montserrat mt-3 flex-1 text-sm leading-relaxed text-[#5c6b7a] sm:text-[0.9375rem]">
            {card.description}
          </p>
          {card.tags && (
            <div className="mt-5 flex flex-wrap gap-2">
              {card.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-montserrat rounded-full bg-[#EFF6FF] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-[#2563EB] sm:text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        {card.image && (
          <div className="relative min-h-[200px] flex-1 sm:min-h-0 sm:max-w-[42%]">
            <Image
              src={card.image}
              alt={card.imageAlt ?? card.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 40vw"
            />
          </div>
        )}
      </article>
    );
  }

  return (
    <article className={`flex h-full flex-col overflow-hidden rounded-3xl bg-white ${cardShadow}`}>
      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <InfrastructureIcon variant={card.variant} />
        <h3 className="font-montserrat mt-4 text-lg font-bold uppercase tracking-wide text-[#083148] sm:text-xl">
          {card.title}
        </h3>
        <p className="font-montserrat mt-3 flex-1 text-sm leading-relaxed text-[#5c6b7a] sm:text-[0.9375rem]">
          {card.description}
        </p>
        {card.partners && (
          <div className="mt-5 grid grid-cols-2 gap-3">
            {card.partners.map((partner) => (
              <div
                key={partner.name}
                className="flex h-14 items-center justify-center px-4 py-3 sm:h-16"
              >
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  width={140}
                  height={48}
                  className="h-8 w-auto max-w-full object-contain sm:h-9"
                />
              </div>
            ))}
          </div>
        )}
      </div>
      {card.image && (
        <div className="relative h-44 w-full sm:h-48 lg:h-52">
          <Image
            src={card.image}
            alt={card.imageAlt ?? card.title}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 33vw"
          />
          <div className="absolute inset-0 bg-[#2563EB]/10" />
        </div>
      )}
    </article>
  );
}
