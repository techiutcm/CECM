import type { AdmissionStep } from "@/lib/site/admission";

interface AdmissionStepIconProps {
  type: AdmissionStep["icon"];
  className?: string;
}

export function AdmissionStepIcon({
  type,
  className = "h-7 w-7",
}: AdmissionStepIconProps) {
  const color = "#083148";

  if (type === "document") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden style={{ color }}>
        <path
          d="M8 4h6l4 4v12H8V4z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path d="M14 4v4h4M10 12h6M10 16h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === "calendar") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden style={{ color }}>
        <rect x="4" y="5" width="16" height="15" rx="2" stroke="currentColor" strokeWidth="1.6" />
        <path d="M8 3v4M16 3v4M4 10h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <rect x="8" y="13" width="3" height="3" rx="0.5" fill="currentColor" />
      </svg>
    );
  }

  if (type === "chat") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden style={{ color }}>
        <path
          d="M6 6h12a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H10l-4 3v-3H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path d="M9 11h6M9 14h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden style={{ color }}>
      <path
        d="M5 9h14v2c0 3-2 5-5 5h-1l-2 2v-2H9c-3 0-4-2-4-5V9z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M9 5h6l1 4H8l1-4z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M7 3h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
