import { HistoriaSection } from "@/components/nosotros/historia-section";
import { NosotrosPageHero } from "@/components/nosotros/nosotros-page-hero";
import { NosotrosSubnav } from "@/components/nosotros/nosotros-subnav";
import { SiteNavbar } from "@/components/site/site-navbar";
import { StagesStats } from "@/components/site/stages-stats";
import { SiteContainer } from "@/components/site/site-container";
import { TransformationSection } from "@/components/site/transformation-section";
import { nosotrosPages } from "@/lib/site/nosotros";
import type { Metadata } from "next";

const page = nosotrosPages.find((item) => item.slug === "historia-y-sedes")!;

export const metadata: Metadata = {
  title: page.label,
  description: page.description,
};

export default function HistoriaYSedesPage() {
  return (
    <>
      <SiteNavbar scrollProgress={1} />
      <NosotrosPageHero
        eyebrow={page.eyebrow}
        title={page.title}
        description={page.description}
      />
      <NosotrosSubnav />
      <HistoriaSection />
      <section className="bg-[#083148] py-14 sm:py-16">
        <SiteContainer>
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-montserrat text-xs font-bold uppercase tracking-[0.25em] text-[#F9B214]">
              En números
            </p>
            <h2 className="font-bebas mt-4 text-3xl uppercase tracking-wide text-white sm:text-4xl">
              Impacto institucional
            </h2>
          </div>
          <StagesStats />
        </SiteContainer>
      </section>
      <TransformationSection />
    </>
  );
}
