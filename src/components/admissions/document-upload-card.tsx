"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import {
  DOCUMENT_FILE_ACCEPT,
  inferDocumentMimeType,
  isImageDocumentMime,
  validateDocumentFile,
} from "@/lib/admissions/document-file";
import type { UploadedDocument } from "@/lib/admissions/types";
import { cn } from "@/lib/utils";
import { Camera, CheckCircle2, FileText, ImageIcon, Loader2, Upload, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useId, useRef, useState } from "react";

interface DocumentUploadCardProps {
  label: string;
  description: string;
  value?: UploadedDocument;
  sessionId: string;
  documentKey: string;
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
  onChange,
  error,
}: DocumentUploadCardProps) {
  const fileInputId = useId();
  const cameraInputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const isImage = value?.mimeType ? isImageDocumentMime(value.mimeType) : false;

  const resetInputs = () => {
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  };

  const uploadFile = useCallback(
    async (file: File) => {
      const validationError = validateDocumentFile(file);
      if (validationError) {
        toast({ title: "Archivo inválido", description: validationError, variant: "error" });
        return;
      }

      setIsUploading(true);

      const mimeType = inferDocumentMimeType(file);
      if (isImageDocumentMime(mimeType)) {
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
        resetInputs();
      }
    },
    [documentKey, label, onChange, sessionId, toast],
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
    resetInputs();
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

      <input
        ref={fileInputRef}
        id={fileInputId}
        type="file"
        className="sr-only"
        accept={DOCUMENT_FILE_ACCEPT}
        onChange={(event) => handleFiles(event.target.files)}
      />

      <input
        ref={cameraInputRef}
        id={cameraInputId}
        type="file"
        className="sr-only"
        accept="image/*"
        capture="environment"
        onChange={(event) => handleFiles(event.target.files)}
      />

      <div
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
        className={cn(
          "relative overflow-hidden rounded-2xl border border-dashed p-5 transition-all",
          isDragging
            ? "border-[#083148] bg-[#083148]/5"
            : "border-[#083148]/20 bg-white/70",
          !isUploading && "md:hover:border-[#083148]/35 md:hover:bg-white",
          isUploading && "pointer-events-none opacity-80",
          error && "border-[#DB2B2C]/50",
        )}
      >
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
                <label
                  htmlFor={fileInputId}
                  className="inline-flex h-9 cursor-pointer items-center justify-center gap-1 rounded-xl border border-[#083148]/15 bg-white/80 px-4 text-xs font-semibold text-[#083148] transition hover:bg-white"
                >
                  <Upload className="h-4 w-4" />
                  Subir archivo
                </label>
                <label
                  htmlFor={cameraInputId}
                  className="inline-flex h-9 cursor-pointer items-center justify-center gap-1 rounded-xl border border-[#083148]/15 bg-white/80 px-4 text-xs font-semibold text-[#083148] transition hover:bg-white md:hidden"
                >
                  <Camera className="h-4 w-4" />
                  Nueva foto
                </label>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={handleRemove}
                >
                  <X className="h-4 w-4" />
                  Quitar
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center justify-center py-4 text-center md:hidden">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#083148]/8">
                <ImageIcon className="h-6 w-6 text-[#083148]" />
              </div>
              <p className="font-montserrat mt-3 text-sm font-semibold text-[#083148]">
                Sube tu documento desde el teléfono
              </p>
              <p className="font-montserrat mt-1 text-xs text-[#083148]/60">
                PDF, JPG, PNG o HEIC · Máximo 10MB
              </p>
              <div className="mt-4 grid w-full grid-cols-1 gap-2">
                <label
                  htmlFor={cameraInputId}
                  className="inline-flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#083148] px-5 text-sm font-semibold text-white shadow-md transition hover:bg-[#0a3d5c]"
                >
                  <Camera className="h-4 w-4" />
                  Tomar foto
                </label>
                <label
                  htmlFor={fileInputId}
                  className="inline-flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#083148]/15 bg-white/80 px-5 text-sm font-semibold text-[#083148] transition hover:bg-white"
                >
                  <Upload className="h-4 w-4" />
                  Subir archivo
                </label>
              </div>
            </div>

            <label
              htmlFor={fileInputId}
              className="hidden cursor-pointer flex-col items-center justify-center py-6 text-center md:flex"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#083148]/8">
                <Upload className="h-6 w-6 text-[#083148]" />
              </div>
              <p className="font-montserrat mt-3 text-sm font-semibold text-[#083148]">
                Arrastra o haz clic para subir
              </p>
              <p className="font-montserrat mt-1 text-xs text-[#083148]/60">
                PDF, JPG, PNG o HEIC · Máximo 10MB
              </p>
            </label>
          </>
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
