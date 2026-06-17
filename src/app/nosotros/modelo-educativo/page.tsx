import { CurricularFusionSection } from "@/components/nosotros/curricular-fusion-section";
import { ModeloIntroSection } from "@/components/nosotros/modelo-intro-section";
import { NosotrosPageHero } from "@/components/nosotros/nosotros-page-hero";
import { NosotrosSubnav } from "@/components/nosotros/nosotros-subnav";
import { PillarsSection } from "@/components/site/pillars-section";
import { SiteNavbar } from "@/components/site/site-navbar";
import { nosotrosPages } from "@/lib/site/nosotros";
import type { Metadata } from "next";

const page = nosotrosPages.find((item) => item.slug === "modelo-educativo")!;

export const metadata: Metadata = {
  title: page.label,
  description: page.description,
};

export default function ModeloEducativoPage() {
  return (
    <>
      <SiteNavbar scrollProgress={1} />
      <NosotrosPageHero
        eyebrow={page.eyebrow}
        title={page.title}
        description={page.description}
        imageSrc={page.heroImage}
      />
      <NosotrosSubnav />
      <ModeloIntroSection />
      <CurricularFusionSection />
      <PillarsSection />
    </>
  );
}
