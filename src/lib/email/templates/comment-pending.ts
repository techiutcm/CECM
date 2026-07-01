import { getSiteUrl } from "@/lib/email/site-url";
import {
  renderEmailDetailsTable,
  renderEmailGreeting,
  renderEmailLayout,
  renderEmailNote,
  renderEmailParagraph,
} from "@/lib/email/templates/base-layout";

export interface CommentPendingEmailPayload {
  to: string[];
  guestName: string;
  guestEmail?: string | null;
  postTitle: string;
  postSlug: string;
  commentPreview: string;
}

export function renderCommentPendingEmail(payload: CommentPendingEmailPayload) {
  const moderationUrl = `${getSiteUrl()}/admin/comments`;
  const postUrl = `${getSiteUrl()}/blog/${payload.postSlug}`;
  const preview =
    payload.commentPreview.length > 280
      ? `${payload.commentPreview.slice(0, 280)}…`
      : payload.commentPreview;

  const bodyHtml = [
    renderEmailGreeting("equipo"),
    renderEmailParagraph(
      "Hay un nuevo comentario pendiente de aprobación en el blog institucional.",
    ),
    renderEmailDetailsTable([
      { label: "Artículo", value: payload.postTitle },
      { label: "Autor del comentario", value: payload.guestName },
      {
        label: "Correo",
        value: payload.guestEmail?.trim() || "No indicado",
      },
    ]),
    renderEmailNote(`“${preview}”`),
    renderEmailParagraph(
      "Puedes revisar el comentario completo y decidir si se publica o se rechaza desde el panel de moderación.",
    ),
  ].join("");

  return renderEmailLayout({
    title: `Comentario pendiente — ${payload.postTitle}`,
    previewText: `Nuevo comentario de ${payload.guestName} en "${payload.postTitle}".`,
    heading: "Comentario pendiente de aprobación",
    bodyHtml,
    cta: {
      label: "Moderar comentarios",
      href: moderationUrl,
    },
  });
}
