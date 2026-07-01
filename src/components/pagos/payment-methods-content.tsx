import { PaymentCampusCard } from "@/components/pagos/payment-campus-card";
import { NosotrosPageHero } from "@/components/nosotros/nosotros-page-hero";
import { SiteContainer } from "@/components/site/site-container";
import {
  paymentCampuses,
  paymentPageContent,
} from "@/lib/site/payment-methods";
import { AlertTriangle, MessageCircle } from "lucide-react";
import Link from "next/link";

export function PaymentMethodsContent() {
  return (
    <>
      <NosotrosPageHero
        eyebrow={paymentPageContent.eyebrow}
        title={paymentPageContent.title}
        description={paymentPageContent.description}
        imageSrc={paymentPageContent.heroImageSrc}
        imageClassName="object-cover object-[72%_center] sm:object-[68%_center]"
      />

      <section className="bg-[#eef2f6] py-12 sm:py-16">
        <SiteContainer>
          <div className="grid gap-8 xl:grid-cols-2">
            {paymentCampuses.map((campus) => (
              <PaymentCampusCard key={campus.id} campus={campus} />
            ))}
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="rounded-2xl border border-[#F9B214]/35 bg-[#FFF8E8] p-5 sm:p-6">
              <div className="flex gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-[#DB2B2C]" aria-hidden />
                <div>
                  <p className="font-montserrat text-sm font-bold uppercase tracking-wide text-[#083148]">
                    Importante
                  </p>
                  <p className="font-montserrat mt-2 text-sm leading-relaxed text-[#083148]/85 sm:text-base">
                    {paymentPageContent.proofNotice}
                  </p>
                </div>
              </div>
            </div>

            <Link
              href={paymentPageContent.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="font-montserrat inline-flex items-center justify-center gap-2 rounded-full bg-[#083148] px-6 py-3.5 text-sm font-bold uppercase tracking-[0.12em] text-[#F9B214] shadow-md transition hover:bg-[#0a3d5c] sm:px-8"
            >
              <MessageCircle className="h-4 w-4" aria-hidden />
              {paymentPageContent.whatsappLabel}
            </Link>
          </div>
        </SiteContainer>
      </section>
    </>
  );
}
