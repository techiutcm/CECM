import { ADMISSION_SHIFTS } from "@/lib/admissions/constants";
import type { AdmissionShift } from "@/lib/admissions/types";

export const ADMISSION_SHIFT_OPTIONS = [
  { value: "Mañana", label: "Mañana" },
  { value: "Tarde", label: "Tarde" },
] as const satisfies readonly { value: AdmissionShift; label: string }[];

const SHIFT_SET = new Set<string>(ADMISSION_SHIFTS);

/**
 * Normaliza el turno guardado. Corrige valores inválidos o índices
 * numéricos que pudieron persistirse por selects no controlados.
 */
export function normalizeAdmissionShift(value: unknown): AdmissionShift | "" {
  if (value === "Mañana" || value === "Tarde") {
    return value;
  }

  if (value === 0 || value === "0") {
    return "Mañana";
  }

  if (value === 1 || value === "1") {
    return "Tarde";
  }

  const normalized = String(value ?? "").trim();
  if (SHIFT_SET.has(normalized)) {
    return normalized as AdmissionShift;
  }

  return "";
}

export function formatAdmissionShift(value: unknown) {
  const normalized = normalizeAdmissionShift(value);
  return normalized || "—";
}
