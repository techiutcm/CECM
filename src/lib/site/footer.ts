import { getVisibleNavigation } from "@/lib/site/navigation";

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
}

export interface FooterSocialLink {
  label: string;
  href: string;
  icon: "facebook" | "instagram" | "youtube" | "tiktok";
}

const activeRoutes = new Set([
  "/",
  "/nosotros/modelo-educativo",
  "/nosotros/historia-y-sedes",
  "/nosotros/infraestructura-resiliencia",
  "/admisiones",
  "/pagos",
  "/blog",
]);

function isActiveRoute(href: string) {
  return activeRoutes.has(href.split("#")[0]);
}

function filterActiveLinks(links: FooterLink[]) {
  return links.filter((link) => isActiveRoute(link.href));
}

export function getFooterColumns(): FooterColumn[] {
  const columns: FooterColumn[] = [
    {
      title: "Inicio",
      links: [{ label: "Inicio", href: "/" }],
    },
  ];

  for (const item of getVisibleNavigation()) {
    if (item.sections?.length) {
      const links = filterActiveLinks(
        item.sections.flatMap((section) =>
          section.items.map((link) => ({
            label: link.label,
            href: link.href,
          })),
        ),
      );

      if (links.length > 0) {
        columns.push({
          title: item.label,
          links,
        });
      }

      continue;
    }

    if (item.href && isActiveRoute(item.href)) {
      columns.push({
        title: item.label,
        links: [{ label: item.label, href: item.href }],
      });
    }
  }

  columns.push({
    title: "Recursos",
    links: [{ label: "Blog", href: "/blog" }],
  });

  return columns;
}

export interface FooterNavGroup {
  title: string;
  links: FooterLink[];
}

export function getFooterNavigationGroups(): FooterNavGroup[] {
  const columns = getFooterColumns();
  const getLinks = (title: string) =>
    columns.find((column) => column.title === title)?.links ?? [];

  return [
    {
      title: "Institución",
      links: [
        ...getLinks("Inicio"),
        ...getLinks("Admisiones"),
        ...getLinks("Pagos"),
        ...getLinks("Recursos"),
      ],
    },
    {
      title: "Modelo Educativo",
      links: getLinks("Nosotros"),
    },
  ].filter((group) => group.links.length > 0);
}

export const footerContent = {
  logoSrc: "/LOGO COMPLEJO CRISTOBAL MENDOZA Y LICEO-01 1.png",
  brandTitle: "Complejo Educativo Dr. Cristóbal Mendoza",
  description:
    "Transformación académica, robótica y alta tecnología para formar líderes del futuro.",
  social: [
    { label: "Facebook", href: "https://facebook.com", icon: "facebook" },
    { label: "Instagram", href: "https://instagram.com", icon: "instagram" },
    { label: "YouTube", href: "https://youtube.com", icon: "youtube" },
    { label: "TikTok", href: "https://tiktok.com", icon: "tiktok" },
  ] satisfies FooterSocialLink[],
  contact: {
    title: "Contacto",
  },
  legal: {
    copyright: "Complejo Educativo Dr. Cristóbal Mendoza. Todos los derechos reservados.",
    tagline: "Desarrollado con Tecnología Educativa",
  },
  cta: {
    title: "¿Listo para formar parte del futuro?",
    description: "Inicia hoy tu proceso de admisión.",
    buttonLabel: "Solicitar Admisión",
    href: "/admisiones",
  },
};
