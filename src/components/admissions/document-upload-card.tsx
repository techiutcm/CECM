"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import {
  ALLOWED_DOCUMENT_TYPES,
  MAX_DOCUMENT_SIZE_BYTES,
} from "@/lib/admissions/constants";
import type { UploadedDocument } from "@/lib/admissions/types";
import { cn } from "@/lib/utils";
import { CheckCircle2, FileText, ImageIcon, Loader2, Upload, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useRef, useState } from "react";

interface DocumentUploadCardProps {
  label: string;
  description: string;
  value?: UploadedDocument;
  sessionId: string;
  documentKey: string;
  isMobile: boolean;
  onChange: (document: UploadedDocument | undefined) => void;
  error?: string;
}

function formatFileSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function DocumentUploadCard({
  label,
  description,
  value,
  sessionId,
  documentKey,
  isMobile,
  onChange,
  error,
}: DocumentUploadCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const isImage = value?.mimeType.startsWith("image/");

  const validateFile = useCallback((file: File) => {
    if (!ALLOWED_DOCUMENT_TYPES.includes(file.type)) {
      return "Formato no permitido. Usa PDF, JPG o PNG.";
    }
    if (file.size > MAX_DOCUMENT_SIZE_BYTES) {
      return "El archivo supera el máximo de 10MB.";
    }
    return null;
  }, []);

  const uploadFile = useCallback(
    async (file: File) => {
      const validationError = validateFile(file);
      if (validationError) {
        toast({ title: "Archivo inválido", description: validationError, variant: "error" });
        return;
      }

      setIsUploading(true);

      if (file.type.startsWith("image/")) {
        setPreviewUrl(URL.createObjectURL(file));
      } else {
        setPreviewUrl(null);
      }

      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("sessionId", sessionId);
        formData.append("documentKey", documentKey);

        const response = await fetch("/api/admissions/upload", {
          method: "POST",
          body: formData,
        });

        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload.error ?? "No se pudo subir el archivo");
        }

        onChange(payload.data as UploadedDocument);
        toast({
          title: "Documento cargado",
          description: `${label} guardado correctamente.`,
          variant: "success",
        });
      } catch (uploadError) {
        setPreviewUrl(null);
        toast({
          title: "Error al subir",
          description:
            uploadError instanceof Error ? uploadError.message : "Intenta nuevamente.",
          variant: "error",
        });
      } finally {
        setIsUploading(false);
      }
    },
    [documentKey, label, onChange, sessionId, toast, validateFile],
  );

  const handleFiles = useCallback(
    (files: FileList | null) => {
      const file = files?.[0];
      if (file) void uploadFile(file);
    },
    [uploadFile],
  );

  const handleRemove = () => {
    onChange(undefined);
    setPreviewUrl(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const displayPreview = previewUrl ?? (isImage ? value?.url : null);
  const isComplete = Boolean(value);

  return (
    <div className="space-y-2">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-montserrat text-sm font-semibold text-[#083148]">{label}</p>
          <p className="font-montserrat text-xs text-[#083148]/60">{description}</p>
        </div>
        {isComplete && (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Completo
          </span>
        )}
      </div>

      <div
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          handleFiles(event.dataTransfer.files);
        }}
        onClick={() => !isUploading && inputRef.current?.click()}
        className={cn(
          "relative overflow-hidden rounded-2xl border border-dashed p-5 transition-all",
          isDragging
            ? "border-[#083148] bg-[#083148]/5"
            : "border-[#083148]/20 bg-white/70 hover:border-[#083148]/35 hover:bg-white",
          isUploading && "pointer-events-none opacity-80",
          error && "border-[#DB2B2C]/50",
        )}
      >
        <input
          ref={inputRef}
          type="file"
          className="sr-only"
          accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
          capture={isMobile ? "environment" : undefined}
          onChange={(event) => handleFiles(event.target.files)}
        />

        {isUploading ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-[#083148]" />
            <p className="font-montserrat mt-3 text-sm font-medium text-[#083148]">
              Subiendo documento...
            </p>
          </div>
        ) : isComplete ? (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            {displayPreview ? (
              <div className="relative h-24 w-24 overflow-hidden rounded-xl border border-[#083148]/10 bg-white">
                <Image
                  src={displayPreview}
                  alt={`Vista previa de ${label}`}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-xl border border-[#083148]/10 bg-[#083148]/5">
                <FileText className="h-8 w-8 text-[#083148]/60" />
              </div>
            )}

            <div className="min-w-0 flex-1">
              <p className="font-montserrat truncate text-sm font-semibold text-[#083148]">
                {value?.fileName}
              </p>
              <p className="font-montserrat mt-1 text-xs text-[#083148]/60">
                {value ? formatFileSize(value.size) : ""}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={(event) => {
                    event.stopPropagation();
                    inputRef.current?.click();
                  }}
                >
                  Reemplazar
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={(event) => {
                    event.stopPropagation();
                    handleRemove();
                  }}
                >
                  <X className="h-4 w-4" />
                  Quitar
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#083148]/8">
              {isMobile ? (
                <ImageIcon className="h-6 w-6 text-[#083148]" />
              ) : (
                <Upload className="h-6 w-6 text-[#083148]" />
              )}
            </div>
            <p className="font-montserrat mt-3 text-sm font-semibold text-[#083148]">
              {isMobile ? "Toca para tomar foto o subir archivo" : "Arrastra o haz clic para subir"}
            </p>
            <p className="font-montserrat mt-1 text-xs text-[#083148]/60">
              PDF, JPG o PNG · Máximo 10MB
            </p>
          </div>
        )}
      </div>

      {error && (
        <p className="font-montserrat text-xs font-medium text-[#DB2B2C]" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
