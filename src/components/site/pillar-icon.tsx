import type { Pillar } from "@/lib/site/pillars";

interface PillarIconProps {
  type: Pillar["icon"];
  color: string;
  className?: string;
}

const iconSources: Record<Pillar["icon"], string> = {
  tech: "/processor-svgrepo-com.svg",
  robotics: "/rocket-ship-svgrepo-com.svg",
  eco: "/leaf-svgrepo-com.svg",
  emotional: "/head-cog-brainstorm-thinking-ideas-svgrepo-com.svg",
};

export function PillarIcon({
  type,
  color,
  className = "h-10 w-10",
}: PillarIconProps) {
  const src = iconSources[type];

  return (
    <span
      aria-hidden
      className={`inline-block shrink-0 ${className}`}
      style={{
        backgroundColor: color,
        WebkitMaskImage: `url(${src})`,
        maskImage: `url(${src})`,
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
      }}
    />
  );
}
