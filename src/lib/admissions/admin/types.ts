import type { AdmissionFormValues, UploadedDocument } from "@/lib/admissions/types";
import type {
  AdmissionPriority,
  AdmissionStatus,
} from "@/lib/admissions/admin/constants";

export interface AdmissionRow {
  id: string;
  session_id: string;
  status: AdmissionStatus;
  priority: AdmissionPriority;
  student_data: AdmissionFormValues["personal"];
  academic_data: AdmissionFormValues["academic"];
  tutor_data: AdmissionFormValues["tutor"];
  documents: AdmissionFormValues["documents"];
  student_photo_url: string | null;
  assigned_to: string | null;
  internal_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface AdmissionListItem {
  id: string;
  status: AdmissionStatus;
  priority: AdmissionPriority;
  studentName: string;
  studentPhoto: string | null;
  grade: string;
  shift: string;
  representativeName: string;
  representativePhone: string;
  provenance: string;
  previousSchool?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdmissionNote {
  id: string;
  admission_id: string;
  author_id: string;
  author_name: string;
  content: string;
  created_at: string;
}

export interface AdmissionActivityItem {
  id: string;
  admission_id: string | null;
  event_type: string;
  title: string;
  description: string | null;
  metadata: Record<string, unknown>;
  created_by: string | null;
  author_name: string | null;
  created_at: string;
}

export interface AdmissionStatusHistoryItem {
  id: string;
  admission_id: string;
  from_status: AdmissionStatus | null;
  to_status: AdmissionStatus;
  changed_by: string | null;
  author_name: string | null;
  note: string | null;
  created_at: string;
}

export interface AdmissionDocumentRow {
  id: string;
  admission_id: string;
  document_type: string;
  url: string;
  storage_path: string;
  file_name: string;
  mime_type: string;
  size_bytes: number;
  is_verified: boolean;
  verified_at: string | null;
  created_at: string;
}

export interface InterviewRow {
  id: string;
  admission_id: string;
  scheduled_at: string;
  assigned_to: string | null;
  assignee_name: string | null;
  status: "scheduled" | "completed" | "cancelled" | "no_show";
  notes: string | null;
  notification_sent: boolean;
  student_name: string;
  grade: string;
  representative_name: string;
  representative_email: string;
  representative_phone: string;
  created_at: string;
}

export interface AdmissionDashboardStats {
  nuevas: number;
  entrevistasPendientes: number;
  admitidos: number;
  enRevision: number;
  rechazados: number;
  total: number;
  weeklyTrend: { label: string; count: number }[];
  byMonth: { label: string; count: number }[];
  byGrade: { label: string; count: number }[];
  byStatus: { label: string; count: number; status: AdmissionStatus }[];
}

export interface AdmissionFilters {
  search?: string;
  status?: AdmissionStatus | "all";
  grade?: string;
  shift?: string;
  provenance?: string | "all";
  dateFrom?: string;
  dateTo?: string;
}

export interface AdmissionDetail extends AdmissionListItem {
  student: AdmissionFormValues["personal"];
  academic: AdmissionFormValues["academic"];
  tutor: AdmissionFormValues["tutor"];
  documents: Record<string, UploadedDocument | undefined>;
  documentRows: AdmissionDocumentRow[];
  notes: AdmissionNote[];
  activity: AdmissionActivityItem[];
  history: AdmissionStatusHistoryItem[];
  interviews: InterviewRow[];
}
