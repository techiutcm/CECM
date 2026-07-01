import { PaymentMethodGroupCard } from "@/components/pagos/payment-method-group-card";
import type { CampusPaymentInfo } from "@/lib/site/payment-methods";
import { MapPin } from "lucide-react";

interface PaymentCampusCardProps {
  campus: CampusPaymentInfo;
}

export function PaymentCampusCard({ campus }: PaymentCampusCardProps) {
  return (
    <article className="rounded-3xl border border-[#083148]/12 bg-white/70 p-6 shadow-lg shadow-[#083148]/5 backdrop-blur-sm sm:p-8">
      <header className="border-b border-[#083148]/10 pb-6">
        <div className="flex items-start gap-3">
          <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#F9B214] text-[#083148]">
            <MapPin className="h-5 w-5" aria-hidden />
          </span>
          <div>
            <p className="font-montserrat text-xs font-bold uppercase tracking-[0.2em] text-[#F9B214]">
              Sede
            </p>
            <h2 className="font-bebas mt-1 text-3xl uppercase tracking-wide text-[#083148] sm:text-4xl">
              {campus.name}
            </h2>
            <p className="font-montserrat mt-2 text-sm text-[#083148]/70 sm:text-base">
              {campus.subtitle}
            </p>
          </div>
        </div>
      </header>

      <div className="mt-6 space-y-4">
        {campus.groups.map((group) => (
          <PaymentMethodGroupCard key={group.id} group={group} />
        ))}
      </div>
    </article>
  );
}
