"use client";

import {
  AdmissionProgress,
  StepNavigation,
} from "@/components/admissions/admission-progress";
import { AdmissionFormSkeleton } from "@/components/admissions/admission-skeleton";
import { AdmissionSuccess } from "@/components/admissions/admission-success";
import { StepAcademic } from "@/components/admissions/steps/step-academic";
import { StepDocuments } from "@/components/admissions/steps/step-documents";
import { StepPersonal } from "@/components/admissions/steps/step-personal";
import { StepSummary } from "@/components/admissions/steps/step-summary";
import { StepTutor } from "@/components/admissions/steps/step-tutor";
import { useToast } from "@/components/ui/toast";
import { useAdmissionPersistence } from "@/hooks/use-admission-persistence";
import { useIsMobile } from "@/hooks/use-is-mobile";
import {
  ADMISSION_STEP_FIELDS,
  ADMISSION_TOTAL_STEPS,
} from "@/lib/admissions/constants";
import type { AdmissionFormValues } from "@/lib/admissions/types";
import {
  admissionStepSchemas,
  admissionSubmitSchema,
} from "@/lib/admissions/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { FormProvider, useForm, type Resolver } from "react-hook-form";
import { z } from "zod";

type WizardView = "form" | "success" | "readonly-summary";

const fullFormSchema = z.object({
  personal: admissionStepSchemas[1].shape.personal,
  academic: admissionStepSchemas[2].shape.academic,
  tutor: admissionStepSchemas[3].shape.tutor,
  documents: admissionStepSchemas[4].shape.documents,
});

export function AdmissionWizard() {
  const { draft, isHydrated, persistDraft, clearDraft } = useAdmissionPersistence();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [currentStep, setCurrentStep] = useState(1);
  const [view, setView] = useState<WizardView>("form");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedValues, setSubmittedValues] = useState<AdmissionFormValues | null>(null);
  const hasHydratedRef = useRef(false);

  const form = useForm<AdmissionFormValues>({
    resolver: zodResolver(fullFormSchema) as Resolver<AdmissionFormValues>,
    defaultValues: draft.values,
    mode: "onChange",
  });

  useEffect(() => {
    if (!isHydrated || hasHydratedRef.current) return;
    form.reset(draft.values);
    setCurrentStep(draft.currentStep);
    hasHydratedRef.current = true;

    const hasSavedProgress =
      draft.currentStep > 1 ||
      Object.values(draft.values.personal).some(Boolean) ||
      Object.values(draft.values.tutor).some(Boolean);

    if (hasSavedProgress) {
      toast({
        title: "Progreso restaurado",
        description: "Continuamos desde donde lo dejaste.",
        variant: "success",
      });
    }
  }, [isHydrated, draft, form, toast]);

  const saveDraft = useCallback(
    (values: AdmissionFormValues, step: number) => {
      persistDraft({
        values,
        currentStep: step,
        sessionId: draft.sessionId,
        updatedAt: new Date().toISOString(),
      });
    },
    [draft.sessionId, persistDraft],
  );

  useEffect(() => {
    if (!isHydrated || view !== "form") return;

    const subscription = form.watch((values) => {
      saveDraft(values as AdmissionFormValues, currentStep);
    });

    return () => subscription.unsubscribe();
  }, [currentStep, form, isHydrated, saveDraft, view]);

  const validateCurrentStep = useCallback(async () => {
    if (currentStep === 5) return true;

    const stepSchema = admissionStepSchemas[currentStep as 1 | 2 | 3 | 4];
    const sectionKey = Object.keys(stepSchema.shape)[0] as keyof AdmissionFormValues;
    const values = form.getValues(sectionKey);
    const result = stepSchema.safeParse({ [sectionKey]: values });

    if (!result.success) {
      const fields = ADMISSION_STEP_FIELDS[currentStep as 1 | 2 | 3 | 4];
      await form.trigger(fields as never);
      toast({
        title: "Revisa los campos",
        description: "Hay información pendiente o inválida en este paso.",
        variant: "error",
      });
      return false;
    }

    return true;
  }, [currentStep, form, toast]);

  const goToStep = useCallback(
    async (nextStep: number) => {
      if (nextStep > currentStep) {
        const isValid = await validateCurrentStep();
        if (!isValid) return;
      }

      setCurrentStep(nextStep);
      saveDraft(form.getValues(), nextStep);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [currentStep, form, saveDraft, validateCurrentStep],
  );

  const handleContinue = async () => {
    if (currentStep < ADMISSION_TOTAL_STEPS) {
      await goToStep(currentStep + 1);
      return;
    }

    await handleSubmit();
  };

  const handleSubmit = async () => {
    const values = form.getValues();
    const parsed = admissionSubmitSchema.safeParse(values);

    if (!parsed.success) {
      toast({
        title: "Información incompleta",
        description: "Revisa el resumen y completa los campos faltantes.",
        variant: "error",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: draft.sessionId,
          ...parsed.data,
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error ?? "No se pudo enviar la solicitud");
      }

      clearDraft();
      setSubmittedValues(parsed.data as AdmissionFormValues);
      form.reset(parsed.data as AdmissionFormValues);
      setView("success");
      toast({
        title: "Solicitud enviada",
        description: "Tu inscripción fue registrada correctamente.",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Error al enviar",
        description: error instanceof Error ? error.message : "Intenta nuevamente.",
        variant: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isHydrated) {
    return <AdmissionFormSkeleton />;
  }

  if (view === "success") {
    return (
      <AdmissionSuccess
        onViewSummary={() => {
          if (submittedValues) {
            form.reset(submittedValues);
          }
          setView("readonly-summary");
          setCurrentStep(5);
        }}
      />
    );
  }

  const isReadonly = view === "readonly-summary";

  return (
    <FormProvider {...form}>
      <div className="mx-auto w-full max-w-[900px] rounded-3xl border border-white/60 bg-white/70 p-6 shadow-2xl backdrop-blur-xl sm:p-10">
        <AdmissionProgress currentStep={currentStep} />

        <div className="mt-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${currentStep}-${view}`}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
            >
              {currentStep === 1 && <StepPersonal />}
              {currentStep === 2 && <StepAcademic />}
              {currentStep === 3 && <StepTutor />}
              {currentStep === 4 && (
                <StepDocuments sessionId={draft.sessionId} isMobile={isMobile} />
              )}
              {currentStep === 5 && (
                <StepSummary
                  readOnly={isReadonly}
                  onEditStep={(step) => {
                    setView("form");
                    setCurrentStep(step);
                    saveDraft(form.getValues(), step);
                  }}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {view === "form" && (
          <div className="mt-8">
            <StepNavigation
              showBack={currentStep > 1}
              onBack={() => void goToStep(currentStep - 1)}
              onContinue={() => void handleContinue()}
              continueLabel={currentStep === 5 ? "Agendar Cita" : "Continuar →"}
              isSubmitting={isSubmitting}
            />
          </div>
        )}

        {isReadonly && currentStep === 5 && (
          <div className="mt-8 flex justify-center">
            <StepNavigation
              showBack={false}
              onContinue={() => setView("success")}
              continueLabel="Volver al mensaje de éxito"
            />
          </div>
        )}
      </div>
    </FormProvider>
  );
}
