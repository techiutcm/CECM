import type { AdmissionFormValues } from "@/lib/admissions/types";

export const MATERNAL_CARE_GRADE = "Materno" as const;
export const MATERNAL_CARE_SHIFT = "Mañana" as const;

export type MaternalCareChoice = "yes" | "no";

export function isMaternalCareEnabled(value: unknown): value is "yes" {
  return value === "yes";
}

export function isMaternalGrade(grade: string) {
  return grade === MATERNAL_CARE_GRADE;
}

export function shouldHideStudentNationalId(maternalCare: unknown) {
  return isMaternalCareEnabled(maternalCare);
}

export function shouldHideAcademicDetailFields(
  grade: string,
  maternalCare?: unknown,
) {
  return isMaternalCareEnabled(maternalCare) || isMaternalGrade(grade);
}

export function isMaternalAdmission(values: Pick<AdmissionFormValues, "personal" | "academic">) {
  return (
    isMaternalCareEnabled(values.personal.maternalCare) ||
    isMaternalGrade(values.academic.grade)
  );
}

export function getAcademicStepTitle(maternalCare: unknown) {
  return isMaternalCareEnabled(maternalCare)
    ? "Información del niño o niña"
    : "Información Escolar del Estudiante";
}

export function getAcademicStepDescription(maternalCare: unknown) {
  return isMaternalCareEnabled(maternalCare)
    ? "Confirma el nivel y turno para el programa de cuidado maternal."
    : "Cuéntanos el grado que cursará y su trayectoria académica.";
}
