import type { StageCard } from "@/lib/site/stages";

interface StageIconProps {
  type: StageCard["icon"];
  className?: string;
}

export function StageIcon({ type, className = "h-8 w-8" }: StageIconProps) {
  if (type === "school") {
    return (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.065c-.384 0-.768.192-1.024.576L2.5 12.5v6.75a.75.75 0 00.75.75h3.75v-4.5h3v4.5h3.75a.75.75 0 00.75-.75v-6.75l-.736-1.859a1.5 1.5 0 00-1.024-.576H4.26z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3L2.5 8.25 12 13.5l9.5-5.25L12 3z" />
      </svg>
    );
  }

  if (type === "university") {
    return (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6M4.5 10.5v9.75a.75.75 0 00.75.75h13.5a.75.75 0 00.75-.75V10.5" />
      </svg>
    );
  }

  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-5.1-2.96a.75.75 0 00-1.14.64v5.82a.75.75 0 001.14.64l5.1-2.96m0 0l5.1 2.96a.75.75 0 001.14-.64v-5.82a.75.75 0 00-1.14-.64l-5.1 2.96z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 2.25l8.25 4.75v9.5L12 21.25 3.75 16.5v-9.5L12 2.25z" />
    </svg>
  );
}
