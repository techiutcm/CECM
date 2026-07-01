import { jsonError, jsonOk } from "@/lib/api/response";
import { MAX_DOCUMENT_SIZE_BYTES } from "@/lib/admissions/constants";
import {
  inferDocumentMimeType,
  isAllowedDocumentFile,
} from "@/lib/admissions/document-file";
import { createServiceClient } from "@/lib/supabase/service";

const BUCKET = "admission-documents";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const sessionId = formData.get("sessionId");
    const documentKey = formData.get("documentKey");

    if (!(file instanceof File)) {
      return jsonError("Se requiere un archivo válido");
    }

    if (typeof sessionId !== "string" || !sessionId.trim()) {
      return jsonError("Sesión inválida");
    }

    if (typeof documentKey !== "string" || !documentKey.trim()) {
      return jsonError("Tipo de documento inválido");
    }

    if (!isAllowedDocumentFile(file)) {
      return jsonError("Formato no permitido. Usa PDF, JPG, PNG o HEIC.");
    }

    if (file.size > MAX_DOCUMENT_SIZE_BYTES) {
      return jsonError("El archivo supera el máximo de 10MB.");
    }

    const mimeType = inferDocumentMimeType(file) || file.type || "application/octet-stream";

    const extension = file.name.split(".").pop()?.toLowerCase() ?? "bin";
    const safeKey = documentKey.replace(/[^a-zA-Z0-9_-]/g, "");
    const path = `${sessionId}/${safeKey}-${Date.now()}-${crypto.randomUUID()}.${extension}`;

    const supabase = createServiceClient();
    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, {
        upsert: false,
        contentType: mimeType,
      });

    if (uploadError) {
      return jsonError(uploadError.message, 500);
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(BUCKET).getPublicUrl(path);

    return jsonOk({
      url: publicUrl,
      path,
      fileName: file.name,
      mimeType,
      size: file.size,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error al subir el archivo";
    return jsonError(message, 500);
  }
}
