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
  title: "Donde las ideas se convierten en",
  titleAccent: "proyectos reales",
  cards: [
    {
      id: "preescolar",
      title: "Educación Inicial (Preescolar)",
      description:
        "Transformamos la curiosidad natural en el primer laboratorio de las grandes ideas. Creamos un entorno seguro y estimulante donde el juego guiado activa el pensamiento lógico, la empatía y la fascinación por descubrir el mundo. Aquí comienza el viaje hacia el futuro.",
      cta: { label: "Explora Preescolar" },
      expanded: {
        title: "Educación Inicial (Preescolar)",
        intro:
          "Estimulación temprana, familiarización con el entorno tecnológico mediante el juego y desarrollo de la motricidad fina y lógica básica.",
        items: [
          {
            id: "juego-exploracion",
            title: "Juego y exploración",
            description:
              "Actividades lúdicas que introducen el entorno tecnológico de forma natural y segura.",
            icon: "crayons",
            iconBg: "#F5B025",
          },
          {
            id: "motricidad-logica",
            title: "Motricidad y lógica básica",
            description:
              "Desarrollo de la motricidad fina y los primeros razonamientos a través del juego guiado.",
            icon: "trophy",
            iconBg: "#0A2533",
          },
        ],
      },
    },
    {
      id: "primary",
      title: "Educación Primaria",
      description:
        "Exploración lúdica y pensamiento lógico. Desde 1.° hasta 6.° grado, evolucionamos el aula en un laboratorio de descubrimiento donde la curiosidad natural guía el aprendizaje tecnológico.",
      cta: { label: "Explora el aula del futuro" },
      expanded: {
        title: "Exploración Lúdica y Pensamiento Lógico",
        intro:
          "Desde 1º hasta 6º grado, evolucionamos el aula en un laboratorio de descubrimiento donde la curiosidad natural guía el aprendizaje tecnológico.",
        items: [
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
      description:
        "Convertimos el aula en un centro de innovación de alta competencia donde la Inteligencia Artificial, la economía digital y la ciencia aeroespacial se fusionan con el liderazgo humano. No formamos estudiantes para el mañana; entrenamos a los líderes tecnológicos del presente.",
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
