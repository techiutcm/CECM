export type EcosystemBentoSize = "featured" | "wide" | "compact";

export interface EcosystemBentoPlacement {
  size: EcosystemBentoSize;
  /** Clases de posición en el grid (sin estado expandido). */
  className: string;
}

/**
 * Bento en 12 columnas — progresión horizontal por etapas:
 *
 * ┌────────┬──────────────────────────┐
 * │Maternal│      Preescolar          │
 * ├────────┴──────────────────────────┤
 * │ Primaria │    Media General       │
 * └──────────┴────────────────────────┘
 */
export const ecosystemBentoLayout: Record<string, EcosystemBentoPlacement> = {
  maternal: {
    size: "compact",
    className: "md:col-span-1 lg:col-span-4 lg:row-span-1",
  },
  preescolar: {
    size: "wide",
    className: "md:col-span-1 lg:col-span-8 lg:row-span-1",
  },
  primary: {
    size: "compact",
    className: "md:col-span-2 lg:col-span-4 lg:row-span-1",
  },
  "media-general": {
    size: "featured",
    className: "md:col-span-2 lg:col-span-8 lg:row-span-1",
  },
};

/** Contenedor del grid bento */
export const ECOSYSTEM_BENTO_GRID_CLASS =
  "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-12 lg:auto-rows-min lg:items-stretch lg:gap-5";

export const ECOSYSTEM_BENTO_EXPANDED_CLASS =
  "md:col-span-2 lg:col-span-12 lg:row-span-2 min-h-[560px] lg:min-h-[640px]";
