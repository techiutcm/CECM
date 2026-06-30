import type { AdmissionRejectedEmailPayload } from "@/lib/email/types";
import { getSiteUrl } from "@/lib/email/site-url";
import {
  renderEmailDetailsTable,
  renderEmailGreeting,
  renderEmailLayout,
  renderEmailNote,
  renderEmailParagraph,
} from "@/lib/email/templates/base-layout";

export function renderAdmissionRejectedEmail(payload: AdmissionRejectedEmailPayload) {
  const previewText = `Actualización sobre la solicitud de admisión de ${payload.studentName}.`;

  const details = [
    { label: "Estudiante", value: payload.studentName },
    { label: "Grado solicitado", value: payload.grade },
  ];

  const bodyHtml = [
    renderEmailGreeting(payload.representativeName),
    renderEmailParagraph(
      `Gracias por su interés en formar parte del proceso de admisión de nuestro complejo educativo. Tras revisar la solicitud, le informamos que en esta ocasión no podremos continuar con el proceso de admisión del estudiante ${payload.studentName}.`,
    ),
    renderEmailDetailsTable(details),
    payload.reason
      ? renderEmailNote(`Motivo u observaciones: ${payload.reason}`)
      : "",
    renderEmailParagraph(
      "Valoramos su confianza en nuestra institución. Si desea más información o desea explorar otras alternativas, nuestro equipo de admisiones está disponible para atenderle.",
    ),
  ].join("");

  return renderEmailLayout({
    title: `Actualización de admisión — ${payload.studentName}`,
    previewText,
    heading: "Actualización sobre su solicitud",
    bodyHtml,
    cta: {
      label: "Contactar admisiones",
      href: `${getSiteUrl()}/admisiones`,
    },
  });
}

export function getAdmissionRejectedEmailSubject(studentName: string) {
  return `Actualización de admisión — ${studentName}`;
}
