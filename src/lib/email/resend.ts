import { renderAdmissionRejectedEmail } from "@/lib/email/templates/admission-rejected";
import { renderCommentPendingEmail } from "@/lib/email/templates/comment-pending";
import { renderInterviewScheduledEmail } from "@/lib/email/templates/interview-scheduled";
import type {
  AdmissionRejectedEmailPayload,
  CommentPendingEmailPayload,
  EmailSendResult,
  InterviewEmailPayload,
} from "@/lib/email/types";
import { Resend } from "resend";

export type {
  AdmissionRejectedEmailPayload,
  CommentPendingEmailPayload,
  EmailSendResult,
  InterviewEmailPayload,
} from "@/lib/email/types";

export function isResendConfigured() {
  return Boolean(process.env.RESEND_API_KEY?.trim());
}

export function getResendFromEmail() {
  return process.env.RESEND_FROM_EMAIL?.trim() || "admisiones@cristobalmendoza.edu.ve";
}

export async function sendInterviewScheduledEmail(
  payload: InterviewEmailPayload,
): Promise<EmailSendResult> {
  if (!isResendConfigured()) {
    return {
      sent: false,
      skipped: true,
      reason: "RESEND_API_KEY no configurada. El correo quedará pendiente.",
    };
  }

  if (!payload.to?.trim()) {
    return {
      sent: false,
      skipped: true,
      reason: "El representante no tiene correo registrado.",
    };
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const html = renderInterviewScheduledEmail(payload);

  const { data, error } = await resend.emails.send({
    from: `Admisiones CECM <${getResendFromEmail()}>`,
    to: payload.to,
    subject: `Entrevista de admisión — ${payload.studentName}`,
    html,
  });

  if (error) {
    return { sent: false, reason: error.message };
  }

  return { sent: true, id: data?.id };
}

export async function sendAdmissionRejectedEmail(
  payload: AdmissionRejectedEmailPayload,
): Promise<EmailSendResult> {
  if (!isResendConfigured()) {
    return {
      sent: false,
      skipped: true,
      reason: "RESEND_API_KEY no configurada. El correo quedará pendiente.",
    };
  }

  if (!payload.to?.trim()) {
    return {
      sent: false,
      skipped: true,
      reason: "El representante no tiene correo registrado.",
    };
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const html = renderAdmissionRejectedEmail(payload);

  const { data, error } = await resend.emails.send({
    from: `Admisiones CECM <${getResendFromEmail()}>`,
    to: payload.to,
    subject: `Actualización de admisión — ${payload.studentName}`,
    html,
  });

  if (error) {
    return { sent: false, reason: error.message };
  }

  return { sent: true, id: data?.id };
}

export async function sendCommentPendingModerationEmail(
  payload: CommentPendingEmailPayload,
): Promise<EmailSendResult> {
  const recipients = payload.to.map((email) => email.trim()).filter(Boolean);

  if (!isResendConfigured()) {
    return {
      sent: false,
      skipped: true,
      reason: "RESEND_API_KEY no configurada. El correo quedará pendiente.",
    };
  }

  if (recipients.length === 0) {
    return {
      sent: false,
      skipped: true,
      reason: "No hay moderadores con correo configurado.",
    };
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const html = renderCommentPendingEmail(payload);

  const { data, error } = await resend.emails.send({
    from: `Blog CECM <${getResendFromEmail()}>`,
    to: recipients,
    subject: `Comentario pendiente — ${payload.postTitle}`,
    html,
  });

  if (error) {
    return { sent: false, reason: error.message };
  }

  return { sent: true, id: data?.id };
}
