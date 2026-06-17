import type { InfrastructureCard } from "@/lib/site/infrastructure";

interface InfrastructureIconProps {
  variant: InfrastructureCard["variant"];
  className?: string;
}

export function InfrastructureIcon({
  variant,
  className = "h-5 w-5",
}: InfrastructureIconProps) {
  const iconClass = `${className} text-[#2563EB]`;

  if (variant === "power") {
    return (
      <svg className={iconClass} viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M13 2L5 14h6l-1 8 8-12h-6l1-8z"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (variant === "connectivity") {
    return (
      <svg className={iconClass} viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M2 8.5C6.5 4 17.5 4 22 8.5M5 12c3-2.5 11-2.5 14 0M8.5 15.5c1.8-1.2 5.2-1.2 7 0M12 19h.01"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="4" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.75" />
      <path d="M8 20h8M12 16v4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      <path
        d="M12 9.5l1.2 2.2 2.4.3-1.7 1.7.4 2.4-2.3-1.2-2.3 1.2.4-2.4-1.7-1.7 2.4-.3L12 9.5z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}
