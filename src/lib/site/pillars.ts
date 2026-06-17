export interface Pillar {
  id: string;
  title: string;
  description: string;
  color: string;
  icon: "tech" | "robotics" | "eco" | "emotional";
  href: string;
}

export const pillars: Pillar[] = [
  {
    id: "tech",
    title: "Tecnología e Industria",
    description: "Python, Inteligencia Artificial aplicada y Fabricación 3D.",
    color: "#22D3EE",
    icon: "tech",
    href: "/nosotros/modelo-educativo",
  },
  {
    id: "robotics",
    title: "Robótica y Aeroespacial",
    description: "Automatización Arduino y telemetría satelital CanSat.",
    color: "#A855F7",
    icon: "robotics",
    href: "/nosotros/modelo-educativo",
  },
  {
    id: "eco",
    title: "Eco-Sustentabilidad",
    description:
      "Biotecnología aplicada y diseño bio-inspirado para un mundo mejor.",
    color: "#4ADE80",
    icon: "eco",
    href: "/nosotros/modelo-educativo",
  },
  {
    id: "emotional",
    title: "Inteligencia Emocional",
    description:
      "Resiliencia técnica, habilidades blandas y liderazgo ético.",
    color: "#FB7185",
    icon: "emotional",
    href: "/nosotros/modelo-educativo",
  },
];
