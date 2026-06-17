import { FooterSocial } from "@/components/site/footer/footer-social";
import { footerContent } from "@/lib/site/footer";
import Image from "next/image";
import Link from "next/link";

export function FooterBrand() {
  const [brandLead, brandName] = footerContent.brandTitle.split(" Dr. ");

  return (
    <div className="order-1 lg:order-1 max-w-md">
      <Link
        href="/"
        className="group inline-flex items-start gap-4 transition-opacity duration-200 hover:opacity-90"
      >
        <div className="relative shrink-0">
          <div
            className="absolute -inset-1 rounded-2xl bg-[#F9B214]/20 opacity-0 blur-md transition-opacity duration-200 group-hover:opacity-100"
            aria-hidden
          />
          <Image
            src={footerContent.logoSrc}
            alt="Complejo Educativo Dr. Cristóbal Mendoza"
            width={80}
            height={80}
            className="relative h-[4.5rem] w-[4.5rem] object-contain sm:h-20 sm:w-20"
          />
        </div>

        <div className="pt-1">
          <p className="font-montserrat text-sm font-semibold uppercase tracking-[0.18em] text-[#083148]/55">
            {brandLead}
          </p>
          <p className="font-bebas mt-1 text-2xl uppercase leading-none tracking-wide text-[#083148] sm:text-[1.75rem]">
            Dr. {brandName}
          </p>
        </div>
      </Link>

      <p className="font-montserrat mt-5 max-w-sm text-sm leading-relaxed text-[#083148]/72 sm:text-[15px]">
        {footerContent.description}
      </p>

      <div className="mt-6">
        <FooterSocial items={footerContent.social} />
      </div>
    </div>
  );
}
