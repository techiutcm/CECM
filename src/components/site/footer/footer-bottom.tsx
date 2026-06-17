import { footerContent } from "@/lib/site/footer";

interface FooterBottomProps {
  year: number;
}

export function FooterBottom({ year }: FooterBottomProps) {
  return (
    <div className="order-5 mt-2 border-t border-[#083148]/10 pt-6 md:col-span-2 lg:order-5 lg:col-span-4">
      <div className="flex flex-col gap-3 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
        <p className="font-montserrat text-xs text-[#083148]/60 sm:text-sm">
          © {year} {footerContent.legal.copyright}
        </p>

        <p className="font-montserrat text-xs text-[#083148]/50 sm:text-sm">
          {footerContent.legal.tagline}
        </p>
      </div>
    </div>
  );
}
