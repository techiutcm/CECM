import { footerContent } from "@/lib/site/footer";
import { cn } from "@/lib/utils";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export function FooterCta() {
  const { cta } = footerContent;

  return (
    <aside className="order-2 lg:order-2 lg:max-w-none">
      <div className="relative overflow-hidden rounded-2xl border border-[#083148]/10 bg-[#083148] p-6 shadow-xl shadow-[#083148]/15 sm:p-7">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,178,20,0.22),transparent_55%),radial-gradient(circle_at_bottom_left,rgba(91,62,140,0.28),transparent_50%)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to right, rgba(255,255,255,0.5) 0, rgba(255,255,255,0.5) 1px, transparent 1px, transparent 24px), repeating-linear-gradient(to bottom, rgba(255,255,255,0.5) 0, rgba(255,255,255,0.5) 1px, transparent 1px, transparent 24px)",
          }}
          aria-hidden
        />

        <div className="relative z-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1">
            <Sparkles className="h-3.5 w-3.5 text-[#F9B214]" aria-hidden />
            <span className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-white/85">
              Admisiones
            </span>
          </div>

          <h3 className="font-bebas text-2xl uppercase leading-tight tracking-wide text-white sm:text-3xl">
            {cta.title}
          </h3>
          <p className="font-montserrat mt-3 text-sm leading-relaxed text-white/75">
            {cta.description}
          </p>

          <Link
            href={cta.href}
            className={cn(
              "font-montserrat mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#F9B214] text-sm font-semibold text-[#083148] shadow-lg shadow-black/10 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#e5a012] hover:shadow-xl",
            )}
          >
            {cta.buttonLabel}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </div>
    </aside>
  );
}
