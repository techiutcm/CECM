import type { EcosystemExpandedItem } from "@/lib/site/ecosystem";

interface EcosystemExpandedIconProps {
  type: EcosystemExpandedItem["icon"];
  className?: string;
}

export function EcosystemExpandedIcon({
  type,
  className = "h-8 w-8",
}: EcosystemExpandedIconProps) {
  if (type === "crayons") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect x="5" y="4" width="3" height="14" rx="1" fill="#F5B025" stroke="#0A2533" strokeWidth="1.2" transform="rotate(-12 6.5 11)" />
        <rect x="10.5" y="4" width="3" height="14" rx="1" fill="#DB2B2C" stroke="#0A2533" strokeWidth="1.2" />
        <rect x="16" y="4" width="3" height="14" rx="1" fill="#4A9EE8" stroke="#0A2533" strokeWidth="1.2" transform="rotate(12 17.5 11)" />
      </svg>
    );
  }

  if (type === "trophy") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M8 5h8v3c0 2.2-1.8 4-4 4s-4-1.8-4-4V5z"
          fill="#F5B025"
          stroke="#0A2533"
          strokeWidth="0.8"
        />
        <path d="M8 6H6a2 2 0 0 0 2 3M16 6h2a2 2 0 0 1-2 3" stroke="#F5B025" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M10 14h4v2H9l-1 3h8l-1-3h-3v-2z" fill="#4A9EE8" stroke="#0A2533" strokeWidth="0.6" />
      </svg>
    );
  }

  if (type === "folder") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M4 7h7l2 2h7v9H4V7z" fill="#F5B025" stroke="#0A2533" strokeWidth="1.2" />
        <rect x="13" y="11" width="5" height="7" rx="0.5" fill="#4A9EE8" stroke="#0A2533" strokeWidth="1" />
        <rect x="14.5" y="12" width="2" height="1.2" fill="#F5B025" />
      </svg>
    );
  }

  if (type === "python") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect x="5.5" y="3.5" width="13" height="17" rx="2" fill="#fff" stroke="#0A2533" strokeWidth="1.2" />
        <path
          d="M8.5 8c0-1.8 1.2-3 3.5-3s3.5 1.2 3.5 3-1.2 3-3.5 3H8.5v3.5h7c2.2 0 3.5 1.2 3.5 3s-1.3 3-3.5 3-3.3 0-3.5-2.2"
          stroke="#3776AB"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <circle cx="14.5" cy="7" r="1" fill="#FFD43B" stroke="#3776AB" strokeWidth="0.5" />
        <circle cx="9.5" cy="17" r="1" fill="#3776AB" />
      </svg>
    );
  }

  if (type === "robot-head") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect x="6.5" y="7.5" width="11" height="10" rx="2" fill="#fff" stroke="#0A2533" strokeWidth="1.2" />
        <circle cx="10" cy="12" r="1.4" fill="#4A9EE8" stroke="#0A2533" strokeWidth="0.5" />
        <circle cx="14" cy="12" r="1.4" fill="#4A9EE8" stroke="#0A2533" strokeWidth="0.5" />
        <path d="M10.5 15h3" stroke="#0A2533" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M12 4.5v3M9 4.5h6" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
        <rect x="4.5" y="10" width="2" height="3.5" rx="0.6" fill="#fff" stroke="#0A2533" strokeWidth="0.8" />
        <rect x="17.5" y="10" width="2" height="3.5" rx="0.6" fill="#fff" stroke="#0A2533" strokeWidth="0.8" />
      </svg>
    );
  }

  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9.5" stroke="#fff" strokeWidth="1.4" strokeDasharray="2.5 2" />
      <circle cx="12" cy="12" r="5" stroke="#F5B025" strokeWidth="2" />
      <path
        d="M12 8v8M8 12h8M9.8 9.8l4.4 4.4M14.2 9.8l-4.4 4.4"
        stroke="#F5B025"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
