import { Resend } from "resend";

export interface InterviewEmailPayload {
  to: string;
  representativeName: string;
  studentName: string;
  scheduledAt: string;
  grade: string;
  notes?: string;
}

export interface EmailSendResult {
  sent: boolean;
  skipped?: boolean;
  reason?: string;
  id?: string;
}

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
  const dateLabel = new Date(payload.scheduledAt).toLocaleString("es-VE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const { data, error } = await resend.emails.send({
    from: `Admisiones CECM <${getResendFromEmail()}>`,
    to: payload.to,
    subject: `Entrevista de admisión — ${payload.studentName}`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #083148; max-width: 560px;">
        <h2 style="color: #5B3E8C;">Entrevista de admisión programada</h2>
        <p>Estimado/a <strong>${payload.representativeName}</strong>,</p>
        <p>Hemos agendado la entrevista de admisión para el estudiante <strong>${payload.studentName}</strong>.</p>
        <ul>
          <li><strong>Grado solicitado:</strong> ${payload.grade}</li>
          <li><strong>Fecha y hora:</strong> ${dateLabel}</li>
        </ul>
        ${payload.notes ? `<p><strong>Observaciones:</strong> ${payload.notes}</p>` : ""}
        <p>Nuestro equipo de admisiones se pondrá en contacto si requiere información adicional.</p>
        <p style="color: #666; font-size: 12px;">Complejo Educativo Dr. Cristóbal Mendoza</p>
      </div>
    `,
  });

  if (error) {
    return { sent: false, reason: error.message };
  }

  return { sent: true, id: data?.id };
}
