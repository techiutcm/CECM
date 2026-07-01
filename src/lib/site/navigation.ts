export interface NavLink {
  label: string;
  href: string;
  description?: string;
}

export interface NavDropdown {
  label: string;
  href?: string;
  highlight?: boolean;
  hidden?: boolean;
  sections?: {
    title?: string;
    items: NavLink[];
  }[];
  items?: NavLink[];
}

export const colegioNavigation: NavDropdown = {
  label: "Colegio y Liceo",
  hidden: true,
  sections: [
    {
      items: [
        {
          label: "Preescolar (Exploración)",
          href: "/colegio/preescolar",
        },
        {
          label: "Educación Primaria (1º a 6º)",
          href: "/colegio/primaria",
        },
        {
          label: "Educación Media General (1º a 5º Año)",
          href: "/colegio/media-general",
        },
        {
          label: "Viabilidad Curricular (Fusión MPPE)",
          href: "/colegio/viabilidad-curricular",
        },
      ],
    },
  ],
};

export const mainNavigation: NavDropdown[] = [
  {
    label: "Nosotros",
    sections: [
      {
        items: [
          {
            label: "Modelo Educativo (Los 4 Pilares)",
            href: "/nosotros/modelo-educativo",
          },
          {
            label: "Nuestra Historia y Sedes",
            href: "/nosotros/historia-y-sedes",
          },
          {
            label: "Infraestructura de Resiliencia",
            href: "/nosotros/infraestructura-resiliencia",
          },
        ],
      },
    ],
  },
  colegioNavigation,
  {
    label: "Admisiones",
    href: "/admisiones",
    highlight: true,
  },
  {
    label: "Pagos",
    href: "/pagos",
  },
  {
    label: "Contacto",
    href: "/contacto",
    hidden: true,
  },
];

export function getVisibleNavigation(): NavDropdown[] {
  return mainNavigation.filter((item) => !item.hidden);
}
