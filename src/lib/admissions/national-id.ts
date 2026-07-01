import { NATIONAL_ID_PREFIXES } from "@/lib/admissions/constants";
import type { AdmissionGrade, NationalIdPrefix } from "@/lib/admissions/types";

export { NATIONAL_ID_PREFIXES };
export type { NationalIdPrefix };

/** Materno y Preescolar hasta 5to grado: cédula opcional o provisional. */
export const GRADES_WITH_OPTIONAL_STUDENT_NATIONAL_ID = [
  "Materno",
  "Preescolar",
  "1er grado",
  "2do grado",
  "3er grado",
  "4to grado",
  "5to grado",
] as const satisfies readonly AdmissionGrade[];

const OPTIONAL_ID_GRADES = new Set<string>(GRADES_WITH_OPTIONAL_STUDENT_NATIONAL_ID);

export function isStudentNationalIdOptional(grade: string) {
  if (!grade) return true;
  return OPTIONAL_ID_GRADES.has(grade);
}

export function parseNationalId(value: string | undefined | null) {
  const trimmed = value?.trim() ?? "";
  if (!trimmed) {
    return { prefix: "V" as NationalIdPrefix, number: "" };
  }

  const match = trimmed.match(/^([VE])-?(.+)$/i);
  if (!match) {
    return { prefix: "V" as NationalIdPrefix, number: trimmed };
  }

  const prefix = match[1].toUpperCase() as NationalIdPrefix;
  return {
    prefix: prefix === "E" ? "E" : "V",
    number: match[2].trim(),
  };
}

/** @deprecated Usa parseNationalId */
export const parseStudentNationalId = parseNationalId;

export function formatNationalId(prefix: string, number: string) {
  const normalizedNumber = number.trim();
  if (!normalizedNumber) return "";

  const normalizedPrefix: NationalIdPrefix = prefix.toUpperCase() === "E" ? "E" : "V";
  return `${normalizedPrefix}-${normalizedNumber}`;
}

/** @deprecated Usa formatNationalId */
export const formatStudentNationalId = formatNationalId;

export function formatNationalIdDisplay(
  prefix: string,
  number: string,
  legacyCombined?: string,
) {
  const combined = formatNationalId(prefix, number) || legacyCombined?.trim() || "";
  if (!combined) return "—";
  return combined;
}

/** @deprecated Usa formatNationalIdDisplay */
export const formatStudentNationalIdDisplay = formatNationalIdDisplay;

export function validateRequiredNationalId(prefix: string, number: string): string | null {
  const normalizedNumber = number.trim();
  const normalizedPrefix = prefix.trim().toUpperCase();

  if (!normalizedNumber) {
    return "La cédula es obligatoria";
  }

  if (normalizedPrefix !== "V" && normalizedPrefix !== "E") {
    return "Selecciona el prefijo de nacionalidad (V o E)";
  }

  if (!/^\d{6,9}$/.test(normalizedNumber)) {
    return "Ingresa una cédula válida (6 a 9 dígitos)";
  }

  return null;
}

export function getTutorNationalIdHelperText() {
  return "Obligatoria. Selecciona prefijo V o E y usa 6 a 9 dígitos.";
}

export function validateStudentNationalId(
  grade: string,
  prefix: string,
  number: string,
): string | null {
  const normalizedNumber = number.trim();
  const normalizedPrefix = prefix.trim().toUpperCase();

  if (!normalizedNumber) {
    if (isStudentNationalIdOptional(grade)) {
      return null;
    }
    return "La cédula es obligatoria para este grado";
  }

  if (normalizedPrefix !== "V" && normalizedPrefix !== "E") {
    return "Selecciona el prefijo de nacionalidad (V o E)";
  }

  if (isStudentNationalIdOptional(grade)) {
    if (!/^[A-Z0-9-]{1,20}$/i.test(normalizedNumber)) {
      return "Ingresa una cédula o identificador provisional válido";
    }
    return null;
  }

  if (!/^\d{6,9}$/.test(normalizedNumber)) {
    return "Ingresa una cédula válida (6 a 9 dígitos)";
  }

  return null;
}

export function getStudentNationalIdHelperText(grade: string) {
  if (isStudentNationalIdOptional(grade)) {
    return "Opcional para Preescolar a 5to grado. Puede dejarse en blanco o usar cédula provisional alfanumérica.";
  }
  if (!grade) {
    return "Selecciona el prefijo V o E. La obligatoriedad depende del grado a cursar.";
  }
  return "Obligatoria para este grado. Usa prefijo V o E y 6 a 9 dígitos.";
}
