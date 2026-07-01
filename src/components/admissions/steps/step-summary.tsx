"use client";

import { Button } from "@/components/ui/button";
import { formatAcademicPerformanceDisplay } from "@/lib/admissions/academic-performance";
import { formatBirthDateDisplay } from "@/lib/admissions/birth-date";
import { DOCUMENT_DEFINITIONS } from "@/lib/admissions/constants";
import { formatNationalIdDisplay } from "@/lib/admissions/national-id";
import { formatAdmissionShift } from "@/lib/admissions/shifts";
import { getProvenanceLabel } from "@/lib/admissions/provenance";
import {
  getAcademicStepTitle,
  isMaternalAdmission,
  shouldHideStudentNationalId,
} from "@/lib/admissions/maternal-care";
import type { AdmissionFormValues } from "@/lib/admissions/types";
import { CheckCircle2, Pencil } from "lucide-react";
import { useFormContext } from "react-hook-form";

interface StepSummaryProps {
  onEditStep: (step: number) => void;
  readOnly?: boolean;
}

interface SummarySectionProps {
  title: string;
  emoji: string;
  onEdit: () => void;
  readOnly?: boolean;
  children: React.ReactNode;
}

function SummarySection({ title, emoji, onEdit, readOnly = false, children }: SummarySectionProps) {
  return (
    <section className="rounded-2xl border border-[#083148]/10 bg-white/75 p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xl" aria-hidden>
            {emoji}
          </span>
          <h3 className="font-montserrat text-base font-semibold text-[#083148]">{title}</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Completo
          </span>
          {!readOnly && (
            <Button type="button" variant="outline" size="sm" onClick={onEdit}>
              <Pencil className="h-3.5 w-3.5" />
              Editar
            </Button>
          )}
        </div>
      </div>
      <dl className="grid gap-3 sm:grid-cols-2">{children}</dl>
    </section>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-montserrat text-xs font-medium uppercase tracking-wide text-[#083148]/55">
        {label}
      </dt>
      <dd className="font-montserrat mt-1 text-sm font-medium text-[#083148]">{value || "—"}</dd>
    </div>
  );
}

export function StepSummary({ onEditStep, readOnly = false }: StepSummaryProps) {
  const { watch } = useFormContext<AdmissionFormValues>();
  const values = watch();

  const repeatedGradeLabel =
    values.academic.repeatedGrade === "yes"
      ? "Sí"
      : values.academic.repeatedGrade === "no"
        ? "No"
        : "—";

  const maternalCareLabel =
    values.personal.maternalCare === "yes"
      ? "Sí"
      : values.personal.maternalCare === "no"
        ? "No"
        : "—";

  const hideStudentNationalId = shouldHideStudentNationalId(values.personal.maternalCare);
  const hideAcademicDetails = isMaternalAdmission(values);
  const academicSectionTitle = getAcademicStepTitle(values.personal.maternalCare);

  return (
    <div className="space-y-6">
      <header>
        <h2 className="font-bebas text-3xl uppercase tracking-wide text-[#083148] sm:text-4xl">
          Resumen de Inscripción
        </h2>
        <p className="font-montserrat mt-2 text-sm text-[#083148]/70 sm:text-base">
          Revisa la información antes de agendar tu cita de admisión.
        </p>
      </header>

      <div className="space-y-4">
        <SummarySection title="Datos Personales" emoji="👤" readOnly={readOnly} onEdit={() => onEditStep(1)}>
          <SummaryItem label="Nombres" value={values.personal.firstName} />
          <SummaryItem label="Apellidos" value={values.personal.lastName} />
          <SummaryItem label="Cuidado Maternal" value={maternalCareLabel} />
          {!hideStudentNationalId && (
            <SummaryItem
              label="Cédula"
              value={formatNationalIdDisplay(
                values.personal.nationalIdPrefix,
                values.personal.nationalIdNumber,
                values.personal.nationalId,
              )}
            />
          )}
          <SummaryItem
            label="Fecha de Nacimiento"
            value={formatBirthDateDisplay(values.personal.birthDate)}
          />
          <SummaryItem label="Teléfono" value={values.personal.phone} />
          <SummaryItem label="Dirección" value={values.personal.address} />
        </SummarySection>

        <SummarySection title={academicSectionTitle} emoji="📚" readOnly={readOnly} onEdit={() => onEditStep(2)}>
          <SummaryItem label="Grado a cursar" value={values.academic.grade} />
          <SummaryItem label="Turno" value={formatAdmissionShift(values.academic.shift)} />
          {!hideAcademicDetails && (
            <>
              <SummaryItem
                label="Procedencia"
                value={getProvenanceLabel(values.academic)}
              />
              <SummaryItem
                label="Escuela de Procedencia"
                value={values.academic.previousSchool ?? ""}
              />
              <SummaryItem
                label="Rendimiento Académico"
                value={formatAcademicPerformanceDisplay(values.academic)}
              />
              <SummaryItem label="¿Repitió algún grado?" value={repeatedGradeLabel} />
            </>
          )}
        </SummarySection>

        <SummarySection
          title="Datos del Representante"
          emoji="👨‍👩‍👧"
          readOnly={readOnly}
          onEdit={() => onEditStep(3)}
        >
          <SummaryItem label="Relación" value={values.tutor.relationship} />
          <SummaryItem label="Nombres" value={values.tutor.firstName} />
          <SummaryItem label="Apellidos" value={values.tutor.lastName} />
          <SummaryItem
            label="Cédula"
            value={formatNationalIdDisplay(
              values.tutor.nationalIdPrefix,
              values.tutor.nationalIdNumber,
              values.tutor.nationalId,
            )}
          />
          <SummaryItem label="Teléfono" value={values.tutor.phone} />
          <SummaryItem label="Correo" value={values.tutor.email} />
          <SummaryItem label="Ocupación" value={values.tutor.occupation} />
          <SummaryItem label="Dirección" value={values.tutor.address} />
        </SummarySection>

        <SummarySection title="Documentos Adjuntos" emoji="📎" readOnly={readOnly} onEdit={() => onEditStep(4)}>
          {DOCUMENT_DEFINITIONS.map((definition) => (
            <SummaryItem
              key={definition.key}
              label={definition.label}
              value={values.documents[definition.key]?.fileName ?? "Pendiente"}
            />
          ))}
        </SummarySection>
      </div>
    </div>
  );
}
