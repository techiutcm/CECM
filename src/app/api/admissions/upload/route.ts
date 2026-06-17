import { jsonError, jsonOk } from "@/lib/api/response";
import {
  ALLOWED_DOCUMENT_TYPES,
  MAX_DOCUMENT_SIZE_BYTES,
} from "@/lib/admissions/constants";
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

    if (!ALLOWED_DOCUMENT_TYPES.includes(file.type)) {
      return jsonError("Formato no permitido. Usa PDF, JPG o PNG.");
    }

    if (file.size > MAX_DOCUMENT_SIZE_BYTES) {
      return jsonError("El archivo supera el máximo de 10MB.");
    }

    const extension = file.name.split(".").pop()?.toLowerCase() ?? "bin";
    const safeKey = documentKey.replace(/[^a-zA-Z0-9_-]/g, "");
    const path = `${sessionId}/${safeKey}-${Date.now()}-${crypto.randomUUID()}.${extension}`;

    const supabase = createServiceClient();
    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, {
        upsert: false,
        contentType: file.type,
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
      mimeType: file.type,
      size: file.size,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error al subir el archivo";
    return jsonError(message, 500);
  }
}
