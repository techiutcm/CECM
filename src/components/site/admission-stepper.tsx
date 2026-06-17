import { AdmissionStepItem } from "@/components/site/admission-step";
import type { AdmissionStep } from "@/lib/site/admission";

interface AdmissionStepperProps {
  steps: AdmissionStep[];
}

export function AdmissionStepper({ steps }: AdmissionStepperProps) {
  return (
    <div className="relative mt-10 sm:mt-12">
      <div
        className="pointer-events-none absolute top-9 right-[10%] left-[10%] hidden border-t-2 border-dashed border-[#083148]/25 lg:block"
        aria-hidden
      />

      <ol className="grid grid-cols-1 gap-0 md:grid-cols-2 md:gap-x-8 md:gap-y-6 lg:grid-cols-4 lg:gap-4">
        {steps.map((step, index) => (
          <AdmissionStepItem
            key={step.id}
            step={step}
            isLast={index === steps.length - 1}
          />
        ))}
      </ol>
    </div>
  );
}
