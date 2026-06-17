export interface InfrastructureCard {
  id: string;
  variant: "power" | "connectivity" | "simulation" | "continuity";
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
  tags?: string[];
  partners?: Array<{ name: string; logo: string }>;
  stat?: string;
  statLabel?: string;
  eyebrow?: string;
}

export const infrastructureCards: InfrastructureCard[] = [
  {
    id: "power",
    variant: "power",
    title: "Respaldo Eléctrico",
    description:
      "Planta eléctrica propia para proteger laboratorios 3D y robótica ante fallas de energía críticas.",
    image:
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Planta eléctrica industrial",
  },
  {
    id: "connectivity",
    variant: "connectivity",
    title: "Conectividad Dedicada",
    description:
      "Internet de alta velocidad optimizado para IA, renderizado en la nube y simulación avanzada sin cuellos de botella.",
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Servidores y fibra óptica",
    tags: ["Fibra Óptica", "Baja Latencia"],
  },
  {
    id: "simulation",
    variant: "simulation",
    title: "Simulación Virtual",
    description:
      "Redundancia crítica con Tinkercad y Wokwi para garantizar las prácticas con o sin componentes físicos.",
    partners: [
      { name: "Tinkercad", logo: "/thinkercadlogo.webp" },
      { name: "Wokwi", logo: "/wokwi.webp" },
    ],
  },
  {
    id: "continuity",
    variant: "continuity",
    eyebrow: "Compromiso de Continuidad",
    title: "Continuidad Operativa Garantizada",
    stat: "99%",
    statLabel: "Continuidad Operativa Garantizada",
    description:
      "Nuestra arquitectura está diseñada para el aprendizaje ininterrumpido. Eliminamos los puntos de fallo único para asegurar que cada sesión de formación ocurra tal como fue planeada.",
  },
];
