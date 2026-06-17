"use server";

import { requireAdminAccess } from "@/lib/admin/guard";
import {
  ADMISSION_STATUS_LABELS,
  type AdmissionStatus,
} from "@/lib/admissions/admin/constants";
import { sendInterviewScheduledEmail } from "@/lib/email/resend";
import { createServiceClient } from "@/lib/supabase/service";
import { revalidatePath } from "next/cache";

async function logStatusChange(
  admissionId: string,
  fromStatus: AdmissionStatus | null,
  toStatus: AdmissionStatus,
  userId: string,
  note?: string,
) {
  const supabase = createServiceClient();

  await supabase.from("admission_status_history").insert({
    admission_id: admissionId,
    from_status: fromStatus,
    to_status: toStatus,
    changed_by: userId,
    note: note ?? null,
  });

  await supabase.from("admission_activity").insert({
    admission_id: admissionId,
    event_type: "status_change",
    title: `Estado actualizado a ${ADMISSION_STATUS_LABELS[toStatus]}`,
    description: note ?? null,
    created_by: userId,
    metadata: { from_status: fromStatus, to_status: toStatus },
  });
}

export async function updateAdmissionStatusAction(
  admissionId: string,
  toStatus: AdmissionStatus,
  note?: string,
) {
  const user = await requireAdminAccess("editor");
  const supabase = createServiceClient();

  const { data: current, error: fetchError } = await supabase
    .from("admissions")
    .select("status")
    .eq("id", admissionId)
    .single();

  if (fetchError) return { error: fetchError.message };

  const fromStatus = current.status as AdmissionStatus;

  const { error } = await supabase
    .from("admissions")
    .update({ status: toStatus })
    .eq("id", admissionId);

  if (error) return { error: error.message };

  await logStatusChange(admissionId, fromStatus, toStatus, user.id, note);

  revalidatePath("/admin/admisiones");
  revalidatePath("/admin/admisiones/solicitudes");
  revalidatePath("/admin/admisiones/entrevistas");
  return { success: true };
}

export async function addAdmissionNoteAction(admissionId: string, content: string) {
  const user = await requireAdminAccess("editor");
  const supabase = createServiceClient();

  const { error } = await supabase.from("admission_notes").insert({
    admission_id: admissionId,
    author_id: user.id,
    content: content.trim(),
  });

  if (error) return { error: error.message };

  await supabase.from("admission_activity").insert({
    admission_id: admissionId,
    event_type: "note_added",
    title: "Nota interna agregada",
    description: content.trim().slice(0, 120),
    created_by: user.id,
  });

  revalidatePath("/admin/admisiones/solicitudes");
  return { success: true };
}

export async function scheduleInterviewAction(input: {
  admissionId: string;
  scheduledAt: string;
  notes?: string;
  assignedTo?: string;
  sendNotification?: boolean;
}) {
  const user = await requireAdminAccess("editor");
  const supabase = createServiceClient();

  const { data: admission, error: admissionError } = await supabase
    .from("admissions")
    .select("student_data, academic_data, tutor_data")
    .eq("id", input.admissionId)
    .single();

  if (admissionError) return { error: admissionError.message };

  const { data: interview, error: interviewError } = await supabase
    .from("interviews")
    .insert({
      admission_id: input.admissionId,
      scheduled_at: input.scheduledAt,
      assigned_to: input.assignedTo ?? user.id,
      notes: input.notes ?? null,
      created_by: user.id,
      notification_sent: false,
    })
    .select("id")
    .single();

  if (interviewError) return { error: interviewError.message };

  const statusResult = await updateAdmissionStatusAction(
    input.admissionId,
    "entrevista_agendada",
    "Entrevista agendada desde el panel administrativo",
  );

  if (statusResult.error) return statusResult;

  await supabase.from("admission_activity").insert({
    admission_id: input.admissionId,
    event_type: "interview_scheduled",
    title: "Entrevista agendada",
    description: input.notes ?? null,
    created_by: user.id,
    metadata: { scheduled_at: input.scheduledAt },
  });

  let notificationMessage: string | undefined;

  if (input.sendNotification) {
    const student = admission.student_data as {
      firstName: string;
      lastName: string;
    };
    const academic = admission.academic_data as { grade?: string };
    const tutor = admission.tutor_data as {
      firstName: string;
      lastName: string;
      email: string;
    };

    const emailResult = await sendInterviewScheduledEmail({
      to: tutor.email,
      representativeName: `${tutor.firstName} ${tutor.lastName}`.trim(),
      studentName: `${student.firstName} ${student.lastName}`.trim(),
      scheduledAt: input.scheduledAt,
      grade: academic.grade ?? "—",
      notes: input.notes,
    });

    if (emailResult.sent) {
      await supabase
        .from("interviews")
        .update({ notification_sent: true })
        .eq("id", interview.id);
      notificationMessage = "Notificación enviada por correo.";
    } else {
      notificationMessage = emailResult.reason ?? "Correo no enviado.";
    }
  }

  revalidatePath("/admin/admisiones/entrevistas");
  return { success: true, notificationMessage };
}

export async function updateInterviewStatusAction(
  interviewId: string,
  status: "scheduled" | "completed" | "cancelled" | "no_show",
) {
  await requireAdminAccess("editor");
  const supabase = createServiceClient();

  const { data: interview, error: fetchError } = await supabase
    .from("interviews")
    .select("admission_id, status")
    .eq("id", interviewId)
    .single();

  if (fetchError) return { error: fetchError.message };

  const { error } = await supabase
    .from("interviews")
    .update({ status })
    .eq("id", interviewId);

  if (error) return { error: error.message };

  if (status === "completed" && interview.admission_id) {
    await updateAdmissionStatusAction(
      interview.admission_id,
      "entrevista_realizada",
      "Entrevista marcada como realizada",
    );
  }

  revalidatePath("/admin/admisiones/entrevistas");
  return { success: true };
}

export async function sendInterviewNotificationAction(interviewId: string) {
  await requireAdminAccess("editor");
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from("interviews")
    .select("id, scheduled_at, notes, admissions(student_data, academic_data, tutor_data)")
    .eq("id", interviewId)
    .single();

  if (error) return { error: error.message };

  const admission = data.admissions as unknown as {
    student_data: { firstName: string; lastName: string };
    academic_data: { grade?: string };
    tutor_data: { firstName: string; lastName: string; email: string };
  };

  const emailResult = await sendInterviewScheduledEmail({
    to: admission.tutor_data.email,
    representativeName: `${admission.tutor_data.firstName} ${admission.tutor_data.lastName}`.trim(),
    studentName: `${admission.student_data.firstName} ${admission.student_data.lastName}`.trim(),
    scheduledAt: data.scheduled_at,
    grade: admission.academic_data.grade ?? "—",
    notes: data.notes ?? undefined,
  });

  if (emailResult.sent) {
    await supabase.from("interviews").update({ notification_sent: true }).eq("id", interviewId);
    revalidatePath("/admin/admisiones/entrevistas");
    return { success: true, message: "Correo enviado correctamente." };
  }

  return {
    success: false,
    message: emailResult.reason ?? "No se pudo enviar el correo.",
    skipped: emailResult.skipped,
  };
}

export async function verifyDocumentsAction(admissionId: string) {
  const user = await requireAdminAccess("editor");
  const supabase = createServiceClient();

  const { error } = await supabase
    .from("admission_documents")
    .update({
      is_verified: true,
      verified_by: user.id,
      verified_at: new Date().toISOString(),
    })
    .eq("admission_id", admissionId);

  if (error) return { error: error.message };

  return updateAdmissionStatusAction(
    admissionId,
    "documentos_verificados",
    "Documentos verificados por el equipo de admisiones",
  );
}
