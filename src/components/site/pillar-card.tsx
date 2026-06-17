import { PillarIcon } from "@/components/site/pillar-icon";
import type { Pillar } from "@/lib/site/pillars";

interface PillarCardProps {
  pillar: Pillar;
}

export function PillarCard({ pillar }: PillarCardProps) {
  return (
    <article
      className="pillar-card group flex flex-col items-center rounded-2xl bg-[#1C1C22] px-5 py-8 text-center shadow-lg shadow-black/20 sm:px-6 sm:py-9"
      style={{ "--pillar-color": pillar.color } as React.CSSProperties}
    >
      <div className="transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110">
        <PillarIcon type={pillar.icon} color={pillar.color} className="h-11 w-11" />
      </div>

      <h3
        className="font-montserrat mt-5 text-sm font-bold uppercase tracking-wide sm:text-[0.9375rem]"
        style={{ color: pillar.color }}
      >
        {pillar.title}
      </h3>

      <p className="font-montserrat mt-4 text-sm leading-relaxed text-white/75">
        {pillar.description}
      </p>
    </article>
  );
}
