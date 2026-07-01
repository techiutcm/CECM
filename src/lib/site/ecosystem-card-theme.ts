export interface EcosystemCardTheme {
  backgroundColor: string;
  titleClass: string;
  bodyClass: string;
  buttonClass: string;
  borderClass: string;
  shadowClass: string;
}

export const ecosystemCardHighlightTheme: EcosystemCardTheme = {
  backgroundColor: "#0A2533",
  titleClass: "text-[#F5B025]",
  bodyClass: "text-[#F5B025]/90",
  buttonClass: "bg-[#F5B025] text-[#0A2533] hover:bg-white",
  borderClass: "border-[#0A2533]",
  shadowClass: "shadow-[0_18px_40px_rgba(10,37,51,0.22)]",
};

export const ecosystemCardThemes: Record<string, EcosystemCardTheme> = {
  maternal: {
    backgroundColor: "#F9B214",
    titleClass: "text-[#0A2533]",
    bodyClass: "text-[#0A2533]/85",
    buttonClass: "bg-[#0A2533] text-[#F5B025] hover:bg-[#0d3045]",
    borderClass: "border-[#0A2533]/15",
    shadowClass: "shadow-[0_10px_28px_rgba(249,178,20,0.22)]",
  },
  preescolar: {
    backgroundColor: "#5B3E8C",
    titleClass: "text-[#F5B025]",
    bodyClass: "text-white/90",
    buttonClass: "bg-[#F5B025] text-[#0A2533] hover:bg-white",
    borderClass: "border-[#4A3270]",
    shadowClass: "shadow-[0_12px_32px_rgba(91,62,140,0.28)]",
  },
  primary: {
    backgroundColor: "#083148",
    titleClass: "text-white",
    bodyClass: "text-white/88",
    buttonClass: "bg-[#F5B025] text-[#0A2533] hover:bg-white",
    borderClass: "border-[#062636]",
    shadowClass: "shadow-[0_12px_32px_rgba(8,49,72,0.28)]",
  },
  "media-general": {
    backgroundColor: "#DB2B2C",
    titleClass: "text-white",
    bodyClass: "text-white/92",
    buttonClass: "bg-[#F5B025] text-[#0A2533] hover:bg-white",
    borderClass: "border-[#B82425]",
    shadowClass: "shadow-[0_14px_36px_rgba(219,43,44,0.28)]",
  },
};

export const ecosystemCardDefaultTheme: EcosystemCardTheme = {
  backgroundColor: "#083148",
  titleClass: "text-white",
  bodyClass: "text-white/88",
  buttonClass: "bg-[#F5B025] text-[#0A2533] hover:bg-white",
  borderClass: "border-[#0A2533]/25",
  shadowClass: "shadow-[0_8px_24px_rgba(10,37,51,0.12)]",
};

export function getEcosystemCardTheme(cardId: string, isHighlighted: boolean) {
  if (isHighlighted) {
    return ecosystemCardHighlightTheme;
  }

  return ecosystemCardThemes[cardId] ?? ecosystemCardDefaultTheme;
}
