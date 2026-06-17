import type {
  ADMISSION_GRADES,
  ADMISSION_SHIFTS,
  TUTOR_RELATIONSHIPS,
} from "@/lib/admissions/constants";

export type AdmissionGrade = (typeof ADMISSION_GRADES)[number];
export type AdmissionShift = (typeof ADMISSION_SHIFTS)[number];
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
    nationalId: string;
    birthDate: string;
    phone: string;
    address: string;
  };
  academic: {
    grade: AdmissionGrade | "";
    shift: AdmissionShift | "";
    sameSchool: boolean;
    previousSchool?: string;
    previousAverage?: string;
    repeatedGrade: "yes" | "no" | "";
  };
  tutor: {
    relationship: TutorRelationship | "";
    firstName: string;
    lastName: string;
    nationalId: string;
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
