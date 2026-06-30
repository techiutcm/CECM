import type { AdmissionFormValues } from "@/lib/admissions/types";
import {
  ADMISSION_STATUS_LABELS,
  KPI_STATUS_GROUPS,
  type AdmissionStatus,
} from "@/lib/admissions/admin/constants";
import type {
  AdmissionDashboardStats,
  AdmissionDetail,
  AdmissionFilters,
  AdmissionListItem,
  AdmissionRow,
} from "@/lib/admissions/admin/types";
import { createServiceClient } from "@/lib/supabase/service";

function mapRowToListItem(row: AdmissionRow): AdmissionListItem {
  const student = row.student_data;
  const academic = row.academic_data;
  const tutor = row.tutor_data;

  return {
    id: row.id,
    status: row.status,
    priority: row.priority,
    studentName: `${student.firstName} ${student.lastName}`.trim(),
    studentPhoto: row.student_photo_url ?? row.documents?.idPhoto?.url ?? null,
    grade: academic.grade || "—",
    shift: academic.shift || "—",
    representativeName: `${tutor.firstName} ${tutor.lastName}`.trim(),
    representativePhone: tutor.phone,
    provenance: academic.provenance || "",
    previousSchool: academic.previousSchool,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function applyFilters(rows: AdmissionRow[], filters?: AdmissionFilters) {
  if (!filters) return rows;

  return rows.filter((row) => {
    const item = mapRowToListItem(row);

    if (filters.status && filters.status !== "all" && row.status !== filters.status) {
      return false;
    }

    if (filters.grade && filters.grade !== "all" && row.academic_data.grade !== filters.grade) {
      return false;
    }

    if (filters.shift && filters.shift !== "all" && row.academic_data.shift !== filters.shift) {
      return false;
    }

    if (filters.provenance && filters.provenance !== "all") {
      const rowProvenance = row.academic_data.provenance;
      const legacyMatch =
        !rowProvenance &&
        filters.provenance === "nacional" &&
        row.academic_data.sameSchool === true;

      if (rowProvenance !== filters.provenance && !legacyMatch) return false;
    }

    if (filters.dateFrom && row.created_at < filters.dateFrom) return false;
    if (filters.dateTo && row.created_at > `${filters.dateTo}T23:59:59`) return false;

    if (filters.search?.trim()) {
      const q = filters.search.toLowerCase();
      const haystack = [
        item.studentName,
        item.representativeName,
        row.student_data.nationalId,
        row.tutor_data.email,
        row.tutor_data.phone,
        row.id,
      ]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }

    return true;
  });
}

export async function getAllAdmissions(filters?: AdmissionFilters): Promise<AdmissionListItem[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("admissions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  const rows = (data ?? []) as AdmissionRow[];
  return applyFilters(rows, filters).map(mapRowToListItem);
}

export async function getAdmissionDashboardStats(): Promise<AdmissionDashboardStats> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("admissions")
    .select("id, status, academic_data, created_at");

  if (error) throw new Error(error.message);

  const rows = (data ?? []) as Pick<AdmissionRow, "id" | "status" | "academic_data" | "created_at">[];

  const countByStatuses = (statuses: AdmissionStatus[]) =>
    rows.filter((row) => statuses.includes(row.status)).length;

  const now = new Date();
  const weeklyTrend = Array.from({ length: 7 }).map((_, index) => {
    const date = new Date(now);
    date.setDate(now.getDate() - (6 - index));
    const label = date.toLocaleDateString("es-VE", { weekday: "short" });
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);
    const count = rows.filter((row) => {
      const created = new Date(row.created_at);
      return created >= dayStart && created <= dayEnd;
    }).length;
    return { label, count };
  });

  const monthMap = new Map<string, number>();
  rows.forEach((row) => {
    const date = new Date(row.created_at);
    const key = date.toLocaleDateString("es-VE", { month: "short", year: "2-digit" });
    monthMap.set(key, (monthMap.get(key) ?? 0) + 1);
  });

  const gradeMap = new Map<string, number>();
  rows.forEach((row) => {
    const grade = row.academic_data?.grade || "Sin grado";
    gradeMap.set(grade, (gradeMap.get(grade) ?? 0) + 1);
  });

  const byStatus = Object.entries(ADMISSION_STATUS_LABELS).map(([status, label]) => ({
    status: status as AdmissionStatus,
    label,
    count: rows.filter((row) => row.status === status).length,
  }));

  return {
    nuevas: countByStatuses(KPI_STATUS_GROUPS.nuevas),
    entrevistasPendientes: countByStatuses(KPI_STATUS_GROUPS.entrevistasPendientes),
    admitidos: countByStatuses(KPI_STATUS_GROUPS.admitidos),
    enRevision: countByStatuses(KPI_STATUS_GROUPS.enRevision),
    rechazados: countByStatuses(KPI_STATUS_GROUPS.rechazados),
    total: rows.length,
    weeklyTrend,
    byMonth: Array.from(monthMap.entries()).map(([label, count]) => ({ label, count })),
    byGrade: Array.from(gradeMap.entries()).map(([label, count]) => ({ label, count })),
    byStatus,
  };
}

export async function getRecentActivity(limit = 8) {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("admission_activity")
    .select("id, admission_id, event_type, title, description, created_at, created_by")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getAdmissionDetail(id: string): Promise<AdmissionDetail | null> {
  const supabase = createServiceClient();

  const { data: admission, error } = await supabase
    .from("admissions")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!admission) return null;

  const row = admission as AdmissionRow;
  const base = mapRowToListItem(row);

  const [notesRes, activityRes, historyRes, docsRes, interviewsRes] = await Promise.all([
    supabase
      .from("admission_notes")
      .select("id, admission_id, author_id, content, created_at")
      .eq("admission_id", id)
      .order("created_at", { ascending: false }),
    supabase
      .from("admission_activity")
      .select("id, admission_id, event_type, title, description, metadata, created_by, created_at")
      .eq("admission_id", id)
      .order("created_at", { ascending: false }),
    supabase
      .from("admission_status_history")
      .select("id, admission_id, from_status, to_status, changed_by, note, created_at")
      .eq("admission_id", id)
      .order("created_at", { ascending: false }),
    supabase
      .from("admission_documents")
      .select("*")
      .eq("admission_id", id)
      .order("created_at", { ascending: true }),
    supabase
      .from("interviews")
      .select("id, admission_id, scheduled_at, assigned_to, status, notes, notification_sent, created_at")
      .eq("admission_id", id)
      .order("scheduled_at", { ascending: false }),
  ]);

  const authorIds = new Set<string>();
  (notesRes.data ?? []).forEach((n) => authorIds.add(n.author_id));
  (activityRes.data ?? []).forEach((a) => a.created_by && authorIds.add(a.created_by));
  (historyRes.data ?? []).forEach((h) => h.changed_by && authorIds.add(h.changed_by));

  let profileMap = new Map<string, string>();
  if (authorIds.size > 0) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name, username")
      .in("id", Array.from(authorIds));
    profileMap = new Map(
      (profiles ?? []).map((p) => [p.id, p.full_name || p.username || "Personal"]),
    );
  }

  return {
    ...base,
    student: row.student_data,
    academic: row.academic_data,
    tutor: row.tutor_data,
    documents: row.documents as AdmissionFormValues["documents"],
    documentRows: (docsRes.data ?? []) as AdmissionDetail["documentRows"],
    notes: (notesRes.data ?? []).map((note) => ({
      ...note,
      author_name: profileMap.get(note.author_id) ?? "Personal",
    })),
    activity: (activityRes.data ?? []).map((item) => ({
      ...item,
      metadata: (item.metadata as Record<string, unknown>) ?? {},
      author_name: item.created_by ? profileMap.get(item.created_by) ?? null : null,
    })),
    history: (historyRes.data ?? []).map((item) => ({
      ...item,
      author_name: item.changed_by ? profileMap.get(item.changed_by) ?? null : null,
    })),
    interviews: (interviewsRes.data ?? []).map((interview) => ({
      ...interview,
      assignee_name: null,
      student_name: base.studentName,
      grade: base.grade,
      representative_name: base.representativeName,
      representative_email: row.tutor_data.email,
      representative_phone: row.tutor_data.phone,
    })),
  };
}

export async function getInterviews() {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("interviews")
    .select("*, admissions(student_data, academic_data, tutor_data)")
    .order("scheduled_at", { ascending: true });

  if (error) throw new Error(error.message);

  return (data ?? []).map((item) => {
    const admission = item.admissions as {
      student_data: AdmissionFormValues["personal"];
      academic_data: AdmissionFormValues["academic"];
      tutor_data: AdmissionFormValues["tutor"];
    } | null;

    return {
      id: item.id,
      admission_id: item.admission_id,
      scheduled_at: item.scheduled_at,
      assigned_to: item.assigned_to,
      assignee_name: null,
      status: item.status,
      notes: item.notes,
      notification_sent: item.notification_sent,
      student_name: admission
        ? `${admission.student_data.firstName} ${admission.student_data.lastName}`
        : "Estudiante",
      grade: admission?.academic_data?.grade ?? "—",
      representative_name: admission
        ? `${admission.tutor_data.firstName} ${admission.tutor_data.lastName}`.trim()
        : "—",
      representative_email: admission?.tutor_data?.email ?? "",
      representative_phone: admission?.tutor_data?.phone ?? "",
      created_at: item.created_at,
    };
  });
}

export async function getEnrolledStudents() {
  const items = await getAllAdmissions({ status: "inscrito" });
  return items;
}
