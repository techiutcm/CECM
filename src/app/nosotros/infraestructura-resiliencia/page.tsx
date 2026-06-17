import { NosotrosPageHero } from "@/components/nosotros/nosotros-page-hero";
import { NosotrosSubnav } from "@/components/nosotros/nosotros-subnav";
import { InfrastructureSection } from "@/components/site/infrastructure-section";
import { SiteNavbar } from "@/components/site/site-navbar";
import { nosotrosPages } from "@/lib/site/nosotros";
import type { Metadata } from "next";

const page = nosotrosPages.find((item) => item.slug === "infraestructura-resiliencia")!;

export const metadata: Metadata = {
  title: page.label,
  description: page.description,
};

export default function InfraestructuraPage() {
  return (
    <>
      <SiteNavbar scrollProgress={1} />
      <NosotrosPageHero
        eyebrow={page.eyebrow}
        title={page.title}
        description={page.description}
      />
      <NosotrosSubnav />
      <InfrastructureSection />
    </>
  );
}
