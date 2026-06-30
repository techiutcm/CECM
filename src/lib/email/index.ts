export { emailBrand } from "@/lib/email/brand";
export {
  buildAdmissionRejectedEmailPreview,
  buildInterviewEmailPreview,
  buildInterviewEmailPreviewFromRow,
} from "@/lib/email/admission-preview";
export type { EmailPreviewData } from "@/lib/email/admission-preview";
export { escapeHtml } from "@/lib/email/escape";
export {
  sendAdmissionRejectedEmail,
  sendInterviewScheduledEmail,
  getResendFromEmail,
  isResendConfigured,
} from "@/lib/email/resend";
export { getAbsoluteAssetUrl, getSiteUrl } from "@/lib/email/site-url";
export {
  renderEmailDetailsTable,
  renderEmailGreeting,
  renderEmailLayout,
  renderEmailNote,
  renderEmailParagraph,
} from "@/lib/email/templates/base-layout";
export type { EmailCta, EmailLayoutOptions } from "@/lib/email/templates/base-layout";
export {
  getAdmissionRejectedEmailSubject,
  renderAdmissionRejectedEmail,
} from "@/lib/email/templates/admission-rejected";
export { renderInterviewScheduledEmail } from "@/lib/email/templates/interview-scheduled";
export type {
  AdmissionRejectedEmailPayload,
  EmailSendResult,
  InterviewEmailPayload,
} from "@/lib/email/types";
