export interface NosotrosPageConfig {
  slug: string;
  href: string;
  label: string;
  eyebrow: string;
  title: string;
  description: string;
  heroImage?: string;
}

export const nosotrosPages: NosotrosPageConfig[] = [
  {
    slug: "modelo-educativo",
    href: "/nosotros/modelo-educativo",
    label: "Modelo Educativo",
    eyebrow: "Los 4 Pilares",
    title: "Modelo Educativo Integral",
    description:
      "Fusionamos el currículo oficial del MPPE con competencias STEM, robótica, sostenibilidad e inteligencia emocional para formar líderes del futuro.",
    heroImage: "/transformation-section-bg.jpg",
  },
  {
    slug: "historia-y-sedes",
    href: "/nosotros/historia-y-sedes",
    label: "Historia y Sedes",
    eyebrow: "Nuestra Trayectoria",
    title: "Historia y Sedes",
    description:
      "Más de una década formando generaciones con excelencia académica, valores sólidos y visión de futuro en el estado Sucre.",
  },
  {
    slug: "infraestructura-resiliencia",
    href: "/nosotros/infraestructura-resiliencia",
    label: "Infraestructura",
    eyebrow: "Resiliencia Tecnológica",
    title: "Infraestructura de Resiliencia",
    description:
      "Espacios, energía y conectividad diseñados para que el aprendizaje nunca se detenga, incluso ante los desafíos del entorno.",
  },
];

export interface HistoriaMilestone {
  year: string;
  title: string;
  description: string;
}

export interface SedeInfo {
  id: string;
  name: string;
  location: string;
  levels: string;
  description: string;
}

export const historiaMilestones: HistoriaMilestone[] = [
  {
    year: "Antes de 2026",
    title: "El Origen: Más de 30 años de Excelencia",
    description:
      "Durante más de tres décadas, el IUTCM (Instituto Universitario de Tecnología Cristóbal Mendoza) se consolidó como un referente en la formación de profesionales técnicos y tecnológicos de alto nivel. Treinta años de investigación pedagógica, infraestructura intelectual y un profundo entendimiento de lo que el mundo universitario y laboral exige.",
  },
  {
    year: "2025",
    title: "La Gran Pregunta",
    description:
      "Tras ver pasar a generaciones de estudiantes universitarios, identificamos una realidad evidente: para formar a los líderes del mañana, no podíamos esperar a que llegaran a la educación superior. Había que sembrar las bases de la lógica, la tecnología y las finanzas éticas desde la infancia. Así comenzó el diseño de un ecosistema escolar disruptivo.",
  },
  {
    year: "2026",
    title: "Nace el Complejo Educativo",
    description:
      "Abrimos oficialmente nuestras puertas. El Complejo Educativo Dr. Cristóbal Mendoza inicia sus operaciones integrando Educación Inicial, Primaria y Media General. Nacemos con la frescura de un modelo educativo del siglo XXI, pero con el aval, el rigor académico y el respaldo institucional de los 30 años de experiencia del IUTCM.",
  },
];

export const historiaIntro = {
  eyebrow: "Nuestra Historia",
  title: "Una institución que evoluciona con su tiempo",
  description:
    "El Complejo Educativo Dr. Cristóbal Mendoza nace en el año 2026, pero nuestra historia comenzó a escribirse hace más de tres décadas. No somos el resultado de una improvisación, sino la evolución natural de un proyecto educativo que ha transformado miles de vidas.",
};

export const sedes: SedeInfo[] = [
  {
    id: "el-vigia",
    name: "Sede El Vigía",
    location:
      "Av Bolivar , Esquina Calle 3, Edificio IUTCM N° 19-12 , Sector Coco Frio diagonal al Hospital II de El Vigía",
    levels: "Preescolar · Primaria · Media General",
    description:
      "Campus central con aulas tecnológicas, laboratorios de robótica, espacios deportivos y zonas de innovación para proyectos estudiantiles.",
  },
  {
    id: "merida",
    name: "Sede Merida",
    location:
      "Av . Urdaneta , Edificio IUTCM a 100 metros de la entrada del Aeropuerto Alberto Carnevalli .",
    levels: "Preescolar · Primaria · Media General",
    description:
      "Campus central con aulas tecnológicas, laboratorios de robótica, espacios deportivos y zonas de innovación para proyectos estudiantiles.",
  },
];

export const modeloEducativoIntro = {
  eyebrow: "Visión pedagógica",
  title: "No añadimos horas de clase, transformamos el aprendizaje",
  description:
    "Nuestro modelo parte del currículo nacional y lo potencia con experiencias prácticas, proyectos reales y tecnología de vanguardia. Cada estudiante desarrolla competencias técnicas, socioemocionales y éticas para liderar en un mundo en constante cambio.",
};

export interface CurricularArea {
  id: string;
  title: string;
  description: string;
  icon: "microscope" | "math" | "books" | "group";
  iconColor: string;
  iconBg: string;
}

export interface CurricularHighlight {
  id: string;
  title: string;
  description: string;
}

export const curricularFusionContent = {
  eyebrow: "Viabilidad Curricular Inteligente",
  title: "Fusión de Contenidos",
  lead: "Nuestra estrategia no añade horas extra al horario escolar.",
  description:
    "Redistribuimos las competencias dentro de las áreas existentes para garantizar el cumplimiento legal del MPPE mientras innovamos.",
  highlights: [
    {
      id: "mppe",
      title: "Cumplimiento MPPE",
      description:
        "Todas las innovaciones se integran dentro del marco curricular oficial vigente.",
    },
    {
      id: "redistribution",
      title: "Redistribución inteligente",
      description:
        "Las competencias técnicas se articulan dentro de las asignaturas ya existentes.",
    },
  ] satisfies CurricularHighlight[],
  areas: [
    {
      id: "ciencias",
      title: "Ciencias Naturales",
      description:
        "Laboratorios de Robótica, Electrónica y Semillero Aeroespacial.",
      icon: "microscope",
      iconColor: "#0A2533",
      iconBg: "rgba(10, 37, 51, 0.1)",
    },
    {
      id: "matematica",
      title: "Matemática e Informática",
      description:
        "Resolución de problemas mediante algoritmos y Python con IA.",
      icon: "math",
      iconColor: "#F5B025",
      iconBg: "rgba(245, 176, 37, 0.2)",
    },
    {
      id: "geografia",
      title: "Geografía, Historia y Ciudadanía",
      description:
        "Unidades de FinTech, Economía Digital, Georreferenciación Satelital (GIS) e Historiografía Interactiva.",
      icon: "books",
      iconColor: "#DB2B2C",
      iconBg: "rgba(219, 43, 44, 0.12)",
    },
    {
      id: "orientacion",
      title: "Orientación y Convivencia",
      description:
        "Desarrollo de Inteligencia Emocional y dinámicas de grupo.",
      icon: "group",
      iconColor: "#0A2533",
      iconBg: "rgba(10, 37, 51, 0.1)",
    },
  ] satisfies CurricularArea[],
};
