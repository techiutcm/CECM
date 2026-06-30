import type { AdmissionDetail, InterviewRow } from "@/lib/admissions/admin/types";
import {
  getAdmissionRejectedEmailSubject,
  renderAdmissionRejectedEmail,
} from "@/lib/email/templates/admission-rejected";
import { renderInterviewScheduledEmail } from "@/lib/email/templates/interview-scheduled";
import type {
  AdmissionRejectedEmailPayload,
  InterviewEmailPayload,
} from "@/lib/email/types";

export interface EmailPreviewData {
  to: string;
  subject: string;
  html: string;
}

function getRepresentativeName(detail: AdmissionDetail) {
  return `${detail.tutor.firstName} ${detail.tutor.lastName}`.trim();
}

function getStudentName(detail: AdmissionDetail) {
  return `${detail.student.firstName} ${detail.student.lastName}`.trim();
}

export function buildInterviewEmailPreview(
  detail: AdmissionDetail,
  scheduledAt: string,
  notes?: string,
): EmailPreviewData | null {
  if (!detail.tutor.email?.trim()) return null;

  const studentName = getStudentName(detail);
  const payload: InterviewEmailPayload = {
    to: detail.tutor.email,
    representativeName: getRepresentativeName(detail),
    studentName,
    scheduledAt,
    grade: detail.academic.grade ?? "—",
    notes,
  };

  return {
    to: payload.to,
    subject: `Entrevista de admisión — ${studentName}`,
    html: renderInterviewScheduledEmail(payload),
  };
}

export function buildAdmissionRejectedEmailPreview(
  detail: AdmissionDetail,
  reason?: string,
): EmailPreviewData | null {
  if (!detail.tutor.email?.trim()) return null;

  const studentName = getStudentName(detail);
  const payload: AdmissionRejectedEmailPayload = {
    to: detail.tutor.email,
    representativeName: getRepresentativeName(detail),
    studentName,
    grade: detail.academic.grade ?? "—",
    reason,
  };

  return {
    to: payload.to,
    subject: getAdmissionRejectedEmailSubject(studentName),
    html: renderAdmissionRejectedEmail(payload),
  };
}

export function buildInterviewEmailPreviewFromRow(
  interview: InterviewRow,
): EmailPreviewData | null {
  if (!interview.representative_email?.trim()) return null;

  const payload: InterviewEmailPayload = {
    to: interview.representative_email,
    representativeName: interview.representative_name,
    studentName: interview.student_name,
    scheduledAt: interview.scheduled_at,
    grade: interview.grade,
    notes: interview.notes ?? undefined,
  };

  return {
    to: payload.to,
    subject: `Entrevista de admisión — ${interview.student_name}`,
    html: renderInterviewScheduledEmail(payload),
  };
}
