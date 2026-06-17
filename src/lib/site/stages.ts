export interface StageCard {
  id: string;
  title: string;
  image: string;
  backText: string;
  ctaLabel: string;
  ctaHref: string;
  backColor: string;
  icon: "school" | "university" | "skills";
}

export const stageCards: StageCard[] = [
  {
    id: "colegio",
    title: "Bases para toda la vida",
    image:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80",
    backText:
      "Desde preescolar hasta bachillerato con formación en valores y continuidad garantizada.",
    ctaLabel: "Ver Colegio y Liceo",
    ctaHref: "/colegio/preescolar",
    backColor: "#083148",
    icon: "school",
  },
  {
    id: "superior",
    title: "Universitarios listos para trabajar",
    image:
      "https://iutcm.edu.ve/wp-content/themes/IutcmThemeV1.1/images/administracion%20de%20empresas.png",
    backText:
      "Carreras cortas con enfoque 100% práctico adaptadas a la región.",
    ctaLabel: "Explorar Carreras TSU",
    ctaHref: "/superior/tsu",
    backColor: "#DB2B2C",
    icon: "university",
  },
  {
    id: "tecnica",
    title: "Habilidades de impacto inmediato",
    image:
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80",
    backText:
      "Certificaciones técnicas con aval nacional para trabajar rápido.",
    ctaLabel: "Ver Oferta de Cursos",
    ctaHref: "/superior/inces",
    backColor: "#F9B214",
    icon: "skills",
  },
];
