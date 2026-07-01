import type { PaymentMethodGroup } from "@/lib/site/payment-methods";
import { Banknote, Building2, Smartphone } from "lucide-react";

const groupIcons = {
  bank: Building2,
  mobile: Smartphone,
  currency: Banknote,
} as const;

interface PaymentMethodGroupCardProps {
  group: PaymentMethodGroup;
}

export function PaymentMethodGroupCard({ group }: PaymentMethodGroupCardProps) {
  const Icon = groupIcons[group.icon];

  return (
    <section className="rounded-2xl border border-[#083148]/10 bg-white/80 p-5 shadow-sm sm:p-6">
      <div className="mb-4 flex items-center gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#083148] text-[#F9B214]">
          <Icon className="h-5 w-5" aria-hidden />
        </span>
        <h3 className="font-montserrat text-sm font-bold uppercase tracking-[0.14em] text-[#083148]">
          {group.title}
        </h3>
      </div>

      <dl className="space-y-3">
        {group.fields.map((field) => (
          <div key={`${group.id}-${field.label}`}>
            <dt className="font-montserrat text-xs font-semibold uppercase tracking-wide text-[#083148]/55">
              {field.label}
            </dt>
            <dd className="font-montserrat mt-1 text-sm font-medium leading-relaxed text-[#083148] sm:text-base">
              {field.value}
            </dd>
          </div>
        ))}
      </dl>

      {group.bullets && group.bullets.length > 0 && (
        <ul className="font-montserrat mt-4 space-y-2 border-t border-[#083148]/8 pt-4 text-sm leading-relaxed text-[#083148]/80">
          {group.bullets.map((bullet) => (
            <li key={bullet} className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#F9B214]" aria-hidden />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
