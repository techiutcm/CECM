import { MAX_DOCUMENT_SIZE_BYTES } from "@/lib/admissions/constants";

export const ALLOWED_DOCUMENT_EXTENSIONS = [
  "pdf",
  "jpg",
  "jpeg",
  "png",
  "webp",
  "heic",
  "heif",
] as const;

export const ALLOWED_DOCUMENT_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
] as const;

const EXTENSION_TO_MIME: Record<string, string> = {
  pdf: "application/pdf",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  heic: "image/heic",
  heif: "image/heif",
};

/** Valor de `accept` compatible con Safari iOS (evita listas MIME largas). */
export const DOCUMENT_FILE_ACCEPT = "application/pdf,image/*,.pdf,.heic,.heif";

export function getFileExtension(fileName: string) {
  return fileName.split(".").pop()?.toLowerCase() ?? "";
}

export function inferDocumentMimeType(file: File) {
  const type = file.type?.trim();
  if (type && type !== "application/octet-stream") {
    return type;
  }

  return EXTENSION_TO_MIME[getFileExtension(file.name)] ?? "";
}

export function isImageDocumentMime(mimeType: string) {
  return mimeType.startsWith("image/");
}

export function isAllowedDocumentFile(file: File) {
  const mimeType = inferDocumentMimeType(file);
  if (ALLOWED_DOCUMENT_MIME_TYPES.includes(mimeType as (typeof ALLOWED_DOCUMENT_MIME_TYPES)[number])) {
    return true;
  }

  const extension = getFileExtension(file.name);
  return ALLOWED_DOCUMENT_EXTENSIONS.includes(
    extension as (typeof ALLOWED_DOCUMENT_EXTENSIONS)[number],
  );
}

export function validateDocumentFile(file: File) {
  if (!isAllowedDocumentFile(file)) {
    return "Formato no permitido. Usa PDF, JPG, PNG o HEIC.";
  }

  if (file.size > MAX_DOCUMENT_SIZE_BYTES) {
    return "El archivo supera el máximo de 10MB.";
  }

  return null;
}
