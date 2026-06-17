import { FooterBottom } from "@/components/site/footer/footer-bottom";
import { FooterBrand } from "@/components/site/footer/footer-brand";
import { FooterContact } from "@/components/site/footer/footer-contact";
import { FooterCta } from "@/components/site/footer/footer-cta";
import { FooterNavigation } from "@/components/site/footer/footer-navigation";
import { SiteContainer } from "@/components/site/site-container";
import { getFooterNavigationGroups } from "@/lib/site/footer";

export function SiteFooter() {
  const year = new Date().getFullYear();
  const navigationGroups = getFooterNavigationGroups();

  return (
    <footer className="relative overflow-hidden border-t border-[#083148]/8 bg-[#ebebed]">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,178,20,0.09),transparent_42%),radial-gradient(circle_at_bottom_left,rgba(8,49,72,0.05),transparent_38%)]"
        aria-hidden
      />

      <SiteContainer className="relative py-12 sm:py-14 lg:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-x-10 md:gap-y-12 lg:grid-cols-[minmax(280px,1.15fr)_minmax(250px,0.9fr)_minmax(0,1fr)_minmax(0,0.95fr)] lg:items-start lg:gap-x-8 xl:gap-x-12">
          <FooterBrand />
          <FooterCta />
          <FooterNavigation groups={navigationGroups} />
          <FooterContact />
          <FooterBottom year={year} />
        </div>
      </SiteContainer>
    </footer>
  );
}
