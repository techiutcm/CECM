import { jsonCreated, jsonError } from "@/lib/api/response";
import { admissionSubmitSchema } from "@/lib/admissions/schema";
import { createServiceClient } from "@/lib/supabase/service";
import { z } from "zod";

const requestSchema = admissionSubmitSchema.extend({
  sessionId: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = requestSchema.safeParse(body);

    if (!parsed.success) {
      return jsonError(parsed.error.issues[0]?.message ?? "Datos inválidos");
    }

    const { sessionId, personal, academic, tutor, documents } = parsed.data;
    const supabase = createServiceClient();

    const { data, error } = await supabase
      .from("admissions")
      .insert({
        session_id: sessionId,
        status: "nueva",
        student_data: personal,
        academic_data: academic,
        tutor_data: tutor,
        documents,
        student_photo_url: documents.idPhoto?.url ?? null,
      })
      .select("id, status, created_at")
      .single();

    if (error) {
      return jsonError(error.message, 500);
    }

    const admissionId = data.id;

    const documentEntries = Object.entries(documents).map(([documentType, doc]) => ({
      admission_id: admissionId,
      document_type: documentType,
      url: doc.url,
      storage_path: doc.path,
      file_name: doc.fileName,
      mime_type: doc.mimeType,
      size_bytes: doc.size,
    }));

    if (documentEntries.length > 0) {
      await supabase.from("admission_documents").insert(documentEntries);
    }

    await supabase.from("admission_status_history").insert({
      admission_id: admissionId,
      from_status: null,
      to_status: "nueva",
      note: "Solicitud creada desde el formulario público",
    });

    await supabase.from("admission_activity").insert({
      admission_id: admissionId,
      event_type: "application_created",
      title: `${personal.firstName} ${personal.lastName} completó su solicitud`,
      description: `Grado solicitado: ${academic.grade}`,
      metadata: { grade: academic.grade, shift: academic.shift },
    });

    return jsonCreated(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error al registrar la admisión";
    return jsonError(message, 500);
  }
}
