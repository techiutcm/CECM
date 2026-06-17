"use client";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ADMISSION_TOTAL_STEPS } from "@/lib/admissions/constants";

interface AdmissionProgressProps {
  currentStep: number;
}

export function AdmissionProgress({ currentStep }: AdmissionProgressProps) {
  const percentage = Math.round((currentStep / ADMISSION_TOTAL_STEPS) * 100);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-4">
        <p className="font-montserrat text-sm font-medium text-[#083148]/75">
          <span>Paso </span>
          <span className="font-semibold text-[#5B3E8C]">{currentStep}</span>
          <span> de </span>
          <span className="font-semibold text-[#083148]">{ADMISSION_TOTAL_STEPS}</span>
        </p>
        <p className="font-montserrat text-sm font-semibold text-[#9A6F00]">
          {percentage}% completado
        </p>
      </div>
      <Progress value={percentage} />
    </div>
  );
}

interface StepNavigationProps {
  onBack?: () => void;
  onContinue?: () => void;
  continueLabel?: string;
  isSubmitting?: boolean;
  showBack?: boolean;
}

export function StepNavigation({
  onBack,
  onContinue,
  continueLabel = "Continuar →",
  isSubmitting = false,
  showBack = true,
}: StepNavigationProps) {
  return (
    <div className="flex flex-col-reverse gap-3 border-t border-[#083148]/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
      {showBack ? (
        <Button type="button" variant="outline" onClick={onBack} disabled={isSubmitting}>
          ← Atrás
        </Button>
      ) : (
        <div />
      )}
      <Button type="button" onClick={onContinue} disabled={isSubmitting} className="sm:min-w-[180px]">
        {isSubmitting ? "Procesando..." : continueLabel}
      </Button>
    </div>
  );
}
