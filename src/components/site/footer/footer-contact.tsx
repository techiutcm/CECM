import { footerContent } from "@/lib/site/footer";
import { sedes } from "@/lib/site/nosotros";
import { MapPin } from "lucide-react";

export function FooterContact() {
  return (
    <div className="order-4 lg:order-4">
      <h3 className="font-montserrat text-xs font-bold uppercase tracking-[0.2em] text-[#083148]/50">
        {footerContent.contact.title}
      </h3>

      <ul className="mt-4 space-y-4">
        {sedes.map((sede) => (
          <li key={sede.id}>
            <div className="group flex gap-3">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#083148]/10 bg-white text-[#083148] shadow-sm transition-all duration-200 group-hover:border-[#F9B214]/35">
                <MapPin className="h-4 w-4" aria-hidden />
              </span>
              <div className="min-w-0 pt-0.5">
                <p className="font-montserrat text-sm font-semibold text-[#083148]">
                  {sede.name}
                </p>
                <p className="font-montserrat mt-1 text-sm leading-relaxed text-[#083148]/78 transition-colors duration-200 group-hover:text-[#083148]">
                  {sede.location}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
