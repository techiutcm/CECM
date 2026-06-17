import { AdmissionStepIcon } from "@/components/site/admission-step-icon";
import type { AdmissionStep } from "@/lib/site/admission";

interface AdmissionStepItemProps {
  step: AdmissionStep;
  isLast?: boolean;
}

export function AdmissionStepItem({ step, isLast = false }: AdmissionStepItemProps) {
  return (
    <li className="relative flex gap-4 lg:flex-col lg:items-center lg:gap-0 lg:text-center">
      <div className="flex shrink-0 flex-col items-center lg:w-full">
        <span className="font-montserrat mb-2 text-sm font-bold text-[#083148] lg:mb-3 lg:text-base">
          {String(step.number).padStart(2, "0")}
        </span>

        <div
          className="relative z-10 flex h-16 w-16 items-center justify-center rounded-lg border-2 bg-white shadow-sm sm:h-[4.5rem] sm:w-[4.5rem]"
          style={{ borderColor: step.borderColor }}
        >
          <AdmissionStepIcon type={step.icon} className="h-8 w-8 sm:h-9 sm:w-9" />
        </div>
      </div>

      <div className="min-w-0 flex-1 pb-6 lg:mt-6 lg:pb-0">
        <h4 className="font-montserrat text-lg font-bold leading-snug text-[#083148] sm:text-xl lg:text-2xl">
          {step.title}
        </h4>
      </div>

      {!isLast && (
        <div
          className="absolute left-8 top-[4.5rem] bottom-0 w-px bg-[#083148]/15 lg:hidden"
          aria-hidden
        />
      )}
    </li>
  );
}
