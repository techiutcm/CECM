import { ADMISSION_STATUS_LABELS } from "@/lib/admissions/admin/constants";
import type { AdmissionRow } from "@/lib/admissions/admin/types";
import { createServiceClient } from "@/lib/supabase/service";
import { formatDate, formatDateTime } from "@/lib/utils/date";

export interface AdmissionExportRow {
  id: string;
  estudiante: string;
  cedula: string;
  grado: string;
  turno: string;
  representante: string;
  telefonoRepresentante: string;
  emailRepresentante: string;
  estado: string;
  fechaSolicitud: string;
  escuelaProcedencia: string;
  promedio: string;
  repitioGrado: string;
}

export async function getAdmissionsForExport(): Promise<AdmissionExportRow[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("admissions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return ((data ?? []) as AdmissionRow[]).map((row) => ({
    id: row.id,
    estudiante: `${row.student_data.firstName} ${row.student_data.lastName}`.trim(),
    cedula: row.student_data.nationalId,
    grado: row.academic_data.grade || "—",
    turno: row.academic_data.shift || "—",
    representante: `${row.tutor_data.firstName} ${row.tutor_data.lastName}`.trim(),
    telefonoRepresentante: row.tutor_data.phone,
    emailRepresentante: row.tutor_data.email,
    estado: ADMISSION_STATUS_LABELS[row.status],
    fechaSolicitud: formatDateTime(row.created_at),
    escuelaProcedencia: row.academic_data.sameSchool
      ? "Mismo colegio"
      : row.academic_data.previousSchool || "—",
    promedio: row.academic_data.previousAverage || "—",
    repitioGrado: row.academic_data.repeatedGrade === "yes" ? "Sí" : "No",
  }));
}

export async function getExportSummary() {
  const supabase = createServiceClient();
  const { data, error } = await supabase.from("admissions").select("status, created_at, academic_data");
  if (error) throw new Error(error.message);

  const rows = data ?? [];
  const total = rows.length;
  const aprobados = rows.filter((r) => r.status === "aprobado" || r.status === "inscrito").length;
  const rechazados = rows.filter((r) => r.status === "rechazado").length;

  return {
    total,
    aprobados,
    rechazados,
    tasaAprobacion: total > 0 ? Math.round((aprobados / total) * 100) : 0,
    generadoEl: formatDate(new Date().toISOString()),
  };
}
