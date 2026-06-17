export interface EcosystemExpandedItem {
  id: string;
  title: string;
  description: string;
  label?: string;
  icon: "crayons" | "trophy" | "folder" | "python" | "robot-head" | "gear-ring";
  iconBg: string;
}

export interface EcosystemExpandedContent {
  title: string;
  intro: string;
  items: EcosystemExpandedItem[];
}

export interface EcosystemCard {
  id: string;
  title: string;
  description: string;
  cta?: { label: string };
  expanded?: EcosystemExpandedContent;
}

export const ecosystemContent = {
  label: "Ecosistema Tecnológico",
  title: "Donde las ideas se convierten en proyectos reales",
  cards: [
    {
      id: "primary",
      title: "Educación Primaria",
      description:
        "Exploración Lúdica y Pensamiento Lógico. Desde 1º hasta 6º grado, evolucionamos el aula en un laboratorio de descubrimiento donde la curiosidad natural guía el aprendizaje tecnológico.",
      cta: { label: "Explora el aula del futuro" },
      expanded: {
        title: "Exploración Lúdica y Pensamiento Lógico",
        intro:
          "Desde 1º hasta 6º grado, evolucionamos el aula en un laboratorio de descubrimiento donde la curiosidad natural guía el aprendizaje tecnológico.",
        items: [
          {
            id: "preescolar",
            title: "Educación Inicial (Preescolar)",
            description:
              "Estimulación temprana, familiarización con el entorno tecnológico mediante el juego y desarrollo de la motricidad fina y lógica básica.",
            icon: "crayons",
            iconBg: "#F5B025",
          },
          {
            id: "primero-tercero",
            title: "1º a 3º Grado",
            description:
              "Lógica de bloques, observación biológica en huertos y reconocimiento de emociones básicas.",
            icon: "trophy",
            iconBg: "#0A2533",
          },
          {
            id: "cuarto-sexto",
            title: "4º a 6º Grado",
            description:
              "Programación visual con Scratch, diseño 3D inicial y resolución colaborativa de conflictos.",
            icon: "folder",
            iconBg: "#DB2B2C",
          },
        ],
      },
    },
    {
      id: "media-general",
      title: "Media General:",
      description: "Excelencia técnica",
      cta: { label: "Explora Media General" },
      expanded: {
        title: "Media General",
        intro: "Excelencia técnica",
        items: [
          {
            id: "python",
            title: "Python Industrial y Datos",
            description:
              "Programación avanzada y herramientas FinTech para mercados éticos.",
            label: "1º a 5º año",
            icon: "python",
            iconBg: "#DB2B2C",
          },
          {
            id: "aeroespacial",
            title: "Ingeniería y Aeroespacial",
            description:
              "Telemetría CanSat y automatización con control inteligente.",
            label: "Alta competencia",
            icon: "robot-head",
            iconBg: "#F5B025",
          },
          {
            id: "proyecto-grado",
            title: "Proyecto de Grado Tech",
            description:
              "Desarrollo y defensa de soluciones tecnológicas aplicadas.",
            label: "Innovación social",
            icon: "gear-ring",
            iconBg: "#0A2533",
          },
        ],
      },
    },
  ] satisfies EcosystemCard[],
};
