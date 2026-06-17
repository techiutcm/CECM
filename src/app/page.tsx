import { AdmissionSection } from "@/components/site/admission-section";
import { EcosystemSection } from "@/components/site/ecosystem-section";
import { HeroBlock } from "@/components/site/hero-block";
import { InfrastructureSection } from "@/components/site/infrastructure-section";
import { PillarsSection } from "@/components/site/pillars-section";
import { StagesSection } from "@/components/site/stages-section";
import { TransformationSection } from "@/components/site/transformation-section";
import { SiteFooter } from "@/components/site/site-footer";
import { getAuthUser } from "@/lib/api/auth";
import { buildNavbarSession } from "@/lib/auth/navbar-session";

export default async function HomePage() {
  const user = await getAuthUser();
  const session = user ? buildNavbarSession(user) : null;

  return (
    <div className="min-h-screen bg-zinc-200/60">
      <div className="p-3 sm:p-4 md:p-6">
        <HeroBlock session={session} />
      </div>
      <StagesSection />
      <PillarsSection />
      <InfrastructureSection />
      <EcosystemSection />
      <AdmissionSection />
      <TransformationSection />
      <SiteFooter />
    </div>
  );
}
