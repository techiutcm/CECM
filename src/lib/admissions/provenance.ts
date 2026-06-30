import {
  ADMISSION_PROVENANCE_LABELS,
  type ADMISSION_PROVENANCE_VALUES,
} from "@/lib/admissions/constants";
import type { AdmissionFormValues } from "@/lib/admissions/types";

export type AdmissionProvenance = (typeof ADMISSION_PROVENANCE_VALUES)[number];

type AcademicProvenanceData = Pick<AdmissionFormValues["academic"], "provenance"> & {
  sameSchool?: boolean;
};

export function getProvenanceLabel(academic: AcademicProvenanceData) {
  if (academic.provenance === "nacional" || academic.provenance === "extranjera") {
    return ADMISSION_PROVENANCE_LABELS[academic.provenance];
  }

  if (academic.sameSchool === true) return "Mismo colegio";
  if (academic.sameSchool === false) return "Otra institución";

  return "—";
}

export function getPreviousSchoolLabel(
  academic: Pick<AdmissionFormValues["academic"], "previousSchool"> & AcademicProvenanceData,
) {
  if (academic.previousSchool?.trim()) return academic.previousSchool;
  if (academic.sameSchool === true) return "Mismo colegio";
  return "—";
}
