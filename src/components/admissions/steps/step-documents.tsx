"use client";

import { DocumentUploadCard } from "@/components/admissions/document-upload-card";
import { DOCUMENT_DEFINITIONS } from "@/lib/admissions/constants";
import type { AdmissionFormValues } from "@/lib/admissions/types";
import { FileCheck2 } from "lucide-react";
import { useFormContext } from "react-hook-form";

interface StepDocumentsProps {
  sessionId: string;
  isMobile: boolean;
}

export function StepDocuments({ sessionId, isMobile }: StepDocumentsProps) {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<AdmissionFormValues>();

  const documents = watch("documents");
  const uploadedCount = DOCUMENT_DEFINITIONS.filter((doc) => documents[doc.key]).length;

  return (
    <div className="space-y-6">
      <header>
        <h2 className="font-bebas text-3xl uppercase tracking-wide text-[#083148] sm:text-4xl">
          Carga de Documentos
        </h2>
        <p className="font-montserrat mt-2 text-sm text-[#083148]/70 sm:text-base">
          Sube los documentos requeridos para completar la solicitud de admisión.
        </p>
      </header>

      <div className="rounded-2xl border border-[#083148]/10 bg-gradient-to-br from-[#083148]/5 to-white/80 p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-montserrat text-sm font-semibold text-[#083148]">Requisitos</p>
            <ul className="font-montserrat mt-2 space-y-1 text-sm text-[#083148]/70">
              <li>• PDF, JPG o PNG</li>
              <li>• Máximo 10MB por archivo</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-[#083148]/10 bg-white/80 px-4 py-3 text-center">
            <p className="font-montserrat text-xs font-medium uppercase tracking-wide text-[#083148]/60">
              Documentos cargados
            </p>
            <p className="font-bebas mt-1 text-3xl tracking-wide text-[#083148]">
              {uploadedCount} / {DOCUMENT_DEFINITIONS.length}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-5">
        {DOCUMENT_DEFINITIONS.map((definition) => (
          <DocumentUploadCard
            key={definition.key}
            label={definition.label}
            description={definition.description}
            value={documents[definition.key]}
            sessionId={sessionId}
            documentKey={definition.key}
            isMobile={isMobile}
            error={errors.documents?.[definition.key]?.message}
            onChange={(document) =>
              setValue(`documents.${definition.key}`, document, {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
          />
        ))}
      </div>

      {uploadedCount === DOCUMENT_DEFINITIONS.length && (
        <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50/80 px-4 py-3">
          <FileCheck2 className="h-5 w-5 text-emerald-600" />
          <p className="font-montserrat text-sm font-medium text-emerald-800">
            Todos los documentos están listos para enviar.
          </p>
        </div>
      )}
    </div>
  );
}
