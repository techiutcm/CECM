import type { AdmissionFormValues, AdmissionGrade } from "@/lib/admissions/types";
import { isMaternalGrade } from "@/lib/admissions/maternal-care";

export const PRIMARY_GRADES = [
  "Preescolar",
  "1er grado",
  "2do grado",
  "3er grado",
  "4to grado",
  "5to grado",
  "6to grado",
] as const satisfies readonly AdmissionGrade[];

export const BACHILLERATO_GRADES = [
  "1er año",
  "2do año",
  "3er año",
  "4to año",
  "5to año",
  "6to año",
] as const satisfies readonly AdmissionGrade[];

export const LITERAL_PERFORMANCE_VALUES = ["A", "B", "C", "D"] as const;

export type PerformanceScale = "literal" | "numeral";
export type LiteralPerformance = (typeof LITERAL_PERFORMANCE_VALUES)[number];

const PRIMARY_SET = new Set<string>(PRIMARY_GRADES);
const BACHILLERATO_SET = new Set<string>(BACHILLERATO_GRADES);
const LITERAL_SET = new Set<string>(LITERAL_PERFORMANCE_VALUES);

type AcademicPerformanceData = Pick<
  AdmissionFormValues["academic"],
  "grade" | "academicPerformance" | "previousAverage"
>;

export function getPerformanceScale(grade: string): PerformanceScale | null {
  if (!grade) return null;
  if (PRIMARY_SET.has(grade)) return "literal";
  if (BACHILLERATO_SET.has(grade)) return "numeral";
  return null;
}

export function resolveAcademicPerformance(academic: AcademicPerformanceData) {
  return academic.academicPerformance?.trim() || academic.previousAverage?.trim() || "";
}

export function validateAcademicPerformance(
  grade: string,
  value: string,
): string | null {
  if (isMaternalGrade(grade)) {
    return null;
  }

  const scale = getPerformanceScale(grade);
  const trimmed = value.trim();

  if (!scale) {
    return "Selecciona primero el grado a cursar";
  }

  if (!trimmed) {
    return "Ingresa el rendimiento académico";
  }

  if (scale === "literal") {
    const normalized = trimmed.toUpperCase();
    if (!LITERAL_SET.has(normalized)) {
      return "Selecciona una calificación literal válida (A, B, C o D)";
    }
    return null;
  }

  const normalized = trimmed.replace(",", ".");
  if (!/^\d{1,2}(\.\d{1,2})?$/.test(normalized)) {
    return "Ingresa un rendimiento numérico válido entre 10 y 20";
  }

  const numeric = Number(normalized);
  if (Number.isNaN(numeric) || numeric < 10 || numeric > 20) {
    return "El rendimiento debe estar entre 10 y 20";
  }

  return null;
}

export function normalizeAcademicPerformance(
  grade: string,
  value: string,
): string | null {
  const error = validateAcademicPerformance(grade, value);
  if (error) return null;

  const scale = getPerformanceScale(grade);
  if (!scale) return null;

  if (scale === "literal") {
    return value.trim().toUpperCase();
  }

  return value.trim().replace(",", ".");
}

export function getPerformanceHelperText(scale: PerformanceScale | null) {
  if (scale === "literal") {
    return "Educación Primaria: escala cualitativa-literal (A, B, C, D).";
  }
  if (scale === "numeral") {
    return "Bachillerato: escala cuantitativa-numeral (10 al 20).";
  }
  return "Selecciona el grado a cursar para habilitar este campo.";
}

export function formatAcademicPerformanceDisplay(academic: AcademicPerformanceData) {
  const value = resolveAcademicPerformance(academic);
  if (!value) return "—";

  const scale = getPerformanceScale(academic.grade);
  if (scale === "literal") {
    return `${value.toUpperCase()} (Literal)`;
  }
  if (scale === "numeral") {
    return `${value.replace(",", ".")} (Numeral)`;
  }

  return value;
}

export function isPrimaryGrade(
  grade: string,
): grade is (typeof PRIMARY_GRADES)[number] {
  return PRIMARY_SET.has(grade);
}

export function isBachilleratoGrade(
  grade: string,
): grade is (typeof BACHILLERATO_GRADES)[number] {
  return BACHILLERATO_SET.has(grade);
}
