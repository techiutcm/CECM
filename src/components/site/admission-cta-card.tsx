import type { admissionContent } from "@/lib/site/admission";
import dynamic from "next/dynamic";
import Link from "next/link";

const AdmissionRocketScene = dynamic(
  () =>
    import("@/components/site/admission-rocket-scene").then(
      (module) => module.AdmissionRocketScene,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center">
        <div className="h-16 w-16 animate-pulse rounded-full bg-[#083148]/10" />
      </div>
    ),
  },
);

interface AdmissionCtaCardProps {
  cta: (typeof admissionContent)["cta"];
}

export function AdmissionCtaCard({ cta }: AdmissionCtaCardProps) {
  return (
    <article className="flex h-full flex-col items-center rounded-sm border-2 border-[#083148]/15 bg-white p-6 text-center shadow-[0_14px_40px_rgba(8,49,72,0.12)] sm:p-8">
      <div className="relative mb-6 h-40 w-full max-w-[220px] sm:mb-8 sm:h-44">
        <div
          className="pointer-events-none absolute inset-x-6 bottom-3 h-16 rounded-full bg-[#ff9a2e]/15 blur-2xl"
          aria-hidden
        />
        <AdmissionRocketScene />
      </div>

      <h3 className="font-bebas text-3xl uppercase leading-[0.95] tracking-wide text-[#083148] sm:text-4xl">
        {cta.title}
      </h3>

      <p className="font-montserrat mt-4 max-w-xs text-sm font-medium leading-relaxed text-[#083148] sm:text-base">
        {cta.description}
      </p>

      <Link
        href={cta.href}
        className="font-montserrat mt-8 inline-flex w-full items-center justify-center gap-2 bg-[#DB2B2C] px-6 py-3.5 text-xs font-bold uppercase tracking-[0.14em] text-white shadow-[0_6px_20px_rgba(219,43,44,0.35)] transition hover:bg-[#c42526] sm:mt-10 sm:px-7 sm:py-4 sm:text-sm"
      >
        {cta.buttonLabel}
        <span aria-hidden>→</span>
      </Link>
    </article>
  );
}
