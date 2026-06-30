export interface InterviewEmailPayload {
  to: string;
  representativeName: string;
  studentName: string;
  scheduledAt: string;
  grade: string;
  notes?: string;
}

export interface AdmissionRejectedEmailPayload {
  to: string;
  representativeName: string;
  studentName: string;
  grade: string;
  reason?: string;
}

export interface EmailSendResult {
  sent: boolean;
  skipped?: boolean;
  reason?: string;
  id?: string;
}
