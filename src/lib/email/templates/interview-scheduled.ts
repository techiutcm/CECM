import type { InterviewEmailPayload } from "@/lib/email/types";
import { getSiteUrl } from "@/lib/email/site-url";
import {
  renderEmailDetailsTable,
  renderEmailGreeting,
  renderEmailLayout,
  renderEmailNote,
  renderEmailParagraph,
} from "@/lib/email/templates/base-layout";

function formatInterviewDate(scheduledAt: string) {
  return new Date(scheduledAt).toLocaleString("es-VE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function renderInterviewScheduledEmail(payload: InterviewEmailPayload) {
  const dateLabel = formatInterviewDate(payload.scheduledAt);
  const previewText = `Entrevista de admisión para ${payload.studentName} el ${dateLabel}.`;

  const details = [
    { label: "Estudiante", value: payload.studentName },
    { label: "Grado solicitado", value: payload.grade },
    { label: "Fecha y hora", value: dateLabel },
  ];

  const bodyHtml = [
    renderEmailGreeting(payload.representativeName),
    renderEmailParagraph(
      `Hemos agendado la entrevista de admisión para el estudiante ${payload.studentName}. A continuación encontrará los detalles de la cita:`,
    ),
    renderEmailDetailsTable(details),
    payload.notes
      ? renderEmailNote(`Observaciones: ${payload.notes}`)
      : "",
    renderEmailParagraph(
      "Nuestro equipo de admisiones se pondrá en contacto si requiere información adicional.",
    ),
  ].join("");

  return renderEmailLayout({
    title: `Entrevista de admisión — ${payload.studentName}`,
    previewText,
    heading: "Entrevista de admisión programada",
    bodyHtml,
    cta: {
      label: "Ver admisiones",
      href: `${getSiteUrl()}/admisiones`,
    },
  });
}
