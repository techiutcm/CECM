import type {
  ADMISSION_GRADES,
  ADMISSION_PROVENANCE_VALUES,
  ADMISSION_SHIFTS,
  NATIONAL_ID_PREFIXES,
  TUTOR_RELATIONSHIPS,
} from "@/lib/admissions/constants";
import type { MaternalCareChoice } from "@/lib/admissions/maternal-care";

export type AdmissionGrade = (typeof ADMISSION_GRADES)[number];
export type AdmissionShift = (typeof ADMISSION_SHIFTS)[number];
export type AdmissionProvenance = (typeof ADMISSION_PROVENANCE_VALUES)[number];
export type NationalIdPrefix = (typeof NATIONAL_ID_PREFIXES)[number];
export type TutorRelationship = (typeof TUTOR_RELATIONSHIPS)[number];

export interface UploadedDocument {
  url: string;
  path: string;
  fileName: string;
  mimeType: string;
  size: number;
}

export interface AdmissionFormValues {
  personal: {
    firstName: string;
    lastName: string;
    maternalCare: MaternalCareChoice | "";
    nationalIdPrefix: NationalIdPrefix;
    nationalIdNumber: string;
    nationalId?: string;
    birthDate: string;
    phone: string;
    address: string;
  };
  academic: {
    grade: AdmissionGrade | "";
    shift: AdmissionShift | "";
    provenance: AdmissionProvenance | "";
    /** Campo legado; solo para solicitudes anteriores al cambio de procedencia. */
    sameSchool?: boolean;
    previousSchool?: string;
    academicPerformance: string;
    /** Campo legado; solo para solicitudes anteriores. */
    previousAverage?: string;
    repeatedGrade: "yes" | "no" | "";
  };
  tutor: {
    relationship: TutorRelationship | "";
    firstName: string;
    lastName: string;
    nationalIdPrefix: NationalIdPrefix;
    nationalIdNumber: string;
    nationalId?: string;
    phone: string;
    email: string;
    occupation: string;
    address: string;
  };
  documents: {
    birthCertificate?: UploadedDocument;
    idPhoto?: UploadedDocument;
    representativeId?: UploadedDocument;
  };
}

export interface AdmissionDraft {
  values: AdmissionFormValues;
  currentStep: number;
  sessionId: string;
  updatedAt: string;
}

export interface AdmissionRecord {
  id: string;
  status: string;
  created_at: string;
}
