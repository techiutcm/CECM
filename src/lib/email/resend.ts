import { renderInterviewScheduledEmail } from "@/lib/email/templates/interview-scheduled";
import { renderAdmissionRejectedEmail } from "@/lib/email/templates/admission-rejected";
import type {
  AdmissionRejectedEmailPayload,
  EmailSendResult,
  InterviewEmailPayload,
} from "@/lib/email/types";
import { Resend } from "resend";

export type {
  AdmissionRejectedEmailPayload,
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
