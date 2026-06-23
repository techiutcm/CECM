import { AdmissionStepIcon } from "@/components/site/admission-step-icon";
import type { AdmissionStep } from "@/lib/site/admission";

interface AdmissionStepItemProps {
  step: AdmissionStep;
  isLast?: boolean;
}

export function AdmissionStepItem({ step, isLast = false }: AdmissionStepItemProps) {
  return (
    <li className="relative flex flex-col items-center gap-4 text-center max-md:pb-2 md:flex-row md:items-start md:gap-4 md:text-left lg:flex-col lg:items-center lg:gap-0 lg:text-center">
      <div className="flex shrink-0 flex-col items-center lg:w-full">
        <span className="font-montserrat mb-2 text-lg font-bold text-[#083148] max-md:mb-3 max-md:text-xl md:text-sm lg:mb-3 lg:text-base">
          {String(step.number).padStart(2, "0")}
        </span>

        <div
          className="relative z-10 flex h-[5.25rem] w-[5.25rem] items-center justify-center rounded-lg border-2 bg-white shadow-sm md:h-16 md:w-16 lg:h-[4.5rem] lg:w-[4.5rem]"
          style={{ borderColor: step.borderColor }}
        >
          <AdmissionStepIcon
            type={step.icon}
            className="h-10 w-10 md:h-8 md:w-8 lg:h-9 lg:w-9"
          />
        </div>
      </div>

      <div className="min-w-0 w-full flex-1 md:pb-6 lg:mt-6 lg:pb-0">
        <h4 className="font-montserrat text-[1.35rem] font-bold leading-snug text-[#083148] max-md:px-2 md:text-lg lg:text-2xl">
          {step.title}
        </h4>
      </div>

      {!isLast && (
        <div
          className="absolute top-[4.5rem] bottom-0 left-8 hidden w-px bg-[#083148]/15 md:block lg:hidden"
          aria-hidden
        />
      )}
    </li>
  );
}
