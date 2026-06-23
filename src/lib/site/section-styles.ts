import type { CSSProperties } from "react";

const techEcosystemGridLines =
  "repeating-linear-gradient(to right, rgba(120, 185, 255, 0.32) 0, rgba(120, 185, 255, 0.32) 1px, transparent 1px, transparent 32px), " +
  "repeating-linear-gradient(to bottom, rgba(120, 185, 255, 0.32) 0, rgba(120, 185, 255, 0.32) 1px, transparent 1px, transparent 32px)";

/** Fondo cuadrícula amarillo institucional (uso general) */
export const techEcosystemGridStyle: CSSProperties = {
  backgroundColor: "#F5B025",
  backgroundImage: techEcosystemGridLines,
};

/** Fondo gris claro con cuadrícula para Ecosistema Tecnológico (home) */
export const ecosystemSectionStyle: CSSProperties = {
  backgroundColor: "#EBEBED",
  backgroundImage: techEcosystemGridLines,
};
