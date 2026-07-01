import { EcosystemExpandedIcon } from "@/components/site/ecosystem-expanded-icon";
import type { EcosystemExpandedContent } from "@/lib/site/ecosystem";

interface EcosystemCardExpandedProps {
  content: EcosystemExpandedContent;
  onClose: () => void;
}

export function EcosystemCardExpanded({
  content,
  onClose,
}: EcosystemCardExpandedProps) {
  return (
    <div className="flex h-full flex-col rounded-xl bg-[#FFF8E8]/92 p-5 shadow-[inset_0_0_0_1px_rgba(10,37,51,0.12)] backdrop-blur-[2px] sm:rounded-2xl sm:p-7 lg:p-8">
      <header className="border-b border-[#0A2533]/15 pb-6 sm:pb-7">
        <h3 className="font-bebas text-4xl uppercase leading-[0.95] tracking-wide text-[#0A2533] sm:text-5xl lg:text-6xl">
          {content.title}
        </h3>

        <p className="font-montserrat mt-4 max-w-4xl text-lg font-medium leading-relaxed text-[#0A2533] sm:mt-5 sm:text-xl lg:text-2xl">
          {content.intro}
        </p>
      </header>

      <ul className="mt-8 space-y-5 sm:mt-10 sm:space-y-6">
        {content.items.map((item, index) => (
          <li key={item.id}>
            <div className="flex gap-5 rounded-sm bg-white/55 p-5 shadow-[0_1px_0_rgba(10,37,51,0.08)] sm:gap-6 sm:p-6 lg:gap-8 lg:p-7">
              <div
                className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-2 border-[#0A2533]/20 shadow-sm sm:h-24 sm:w-24 lg:h-28 lg:w-28"
                style={{ backgroundColor: item.iconBg }}
              >
                <EcosystemExpandedIcon
                  type={item.icon}
                  className="h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14"
                />
              </div>

              <div className="min-w-0 flex-1 pt-0.5 sm:pt-1">
                <h4 className="font-montserrat text-lg font-bold leading-snug text-[#0A2533] sm:text-xl lg:text-2xl">
                  {item.title}
                </h4>
                <p className="font-montserrat mt-3 text-base font-medium leading-[1.7] text-[#0A2533] sm:mt-3.5 sm:text-lg lg:text-xl lg:leading-[1.75]">
                  {item.description}
                </p>
                {item.label && (
                  <p className="font-montserrat mt-4 inline-block border border-[#0A2533]/25 bg-[#0A2533]/5 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.22em] text-[#0A2533] sm:mt-5 sm:text-sm">
                    {item.label}
                  </p>
                )}
              </div>
            </div>

            {index < content.items.length - 1 && (
              <div className="mx-5 mt-5 h-px bg-[#0A2533]/12 sm:mx-6 sm:mt-6" aria-hidden />
            )}
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={onClose}
        className="font-montserrat mt-10 inline-flex w-fit items-center gap-2 bg-[#0A2533] px-7 py-4 text-sm font-bold uppercase tracking-[0.15em] text-[#F5B025] shadow-md transition hover:bg-[#0d3045] sm:mt-12 sm:px-8 sm:py-4 sm:text-base"
      >
        Cerrar
      </button>
    </div>
  );
}
