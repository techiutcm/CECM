export const ADMISSION_STORAGE_KEY = "cecm-admission-draft-v1";
export const ADMISSION_SESSION_KEY = "cecm-admission-session-v1";
export const ADMISSION_TOTAL_STEPS = 5;

export const ADMISSION_GRADES = [
  "Materno",
  "Preescolar",
  "1er grado",
  "2do grado",
  "3er grado",
  "4to grado",
  "5to grado",
  "6to grado",
  "1er año",
  "2do año",
  "3er año",
  "4to año",
  "5to año",
  "6to año",
] as const;

export const ADMISSION_SHIFTS = ["Mañana", "Tarde"] as const;

export const NATIONAL_ID_PREFIXES = ["V", "E"] as const;

export const ADMISSION_PROVENANCE_VALUES = ["nacional", "extranjera"] as const;

export const ADMISSION_PROVENANCE_LABELS: Record<
  (typeof ADMISSION_PROVENANCE_VALUES)[number],
  string
> = {
  nacional: "Procedencia Nacional",
  extranjera: "Procedencia Extranjera",
};

export const TUTOR_RELATIONSHIPS = [
  "Padre",
  "Madre",
  "Representante Legal",
  "Tutor",
  "Abuelo",
  "Abuela",
  "Tío",
  "Tía",
  "Otro",
] as const;

export const DOCUMENT_DEFINITIONS = [
  {
    key: "birthCertificate" as const,
    label: "Partida de Nacimiento",
    description: "Documento oficial del estudiante",
  },
  {
    key: "idPhoto" as const,
    label: "Foto Tipo Carnet",
    description: "Fondo blanco, rostro visible",
  },
  {
    key: "representativeId" as const,
    label: "Cédula del Representante",
    description: "Documento de identidad vigente",
  },
];

export const ALLOWED_DOCUMENT_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
];

export const MAX_DOCUMENT_SIZE_BYTES = 10 * 1024 * 1024;

export const ADMISSION_STEP_FIELDS = {
  1: [
    "personal.firstName",
    "personal.lastName",
    "personal.maternalCare",
    "personal.nationalIdPrefix",
    "personal.nationalIdNumber",
    "personal.birthDate",
    "personal.phone",
    "personal.address",
  ],
  2: [
    "academic.grade",
    "academic.shift",
    "academic.provenance",
    "academic.previousSchool",
    "academic.academicPerformance",
    "academic.repeatedGrade",
  ],
  3: [
    "tutor.relationship",
    "tutor.firstName",
    "tutor.lastName",
    "tutor.nationalIdPrefix",
    "tutor.nationalIdNumber",
    "tutor.phone",
    "tutor.email",
    "tutor.occupation",
    "tutor.address",
  ],
  4: ["documents.birthCertificate", "documents.idPhoto", "documents.representativeId"],
} as const;
