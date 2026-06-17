export const ADMISSION_STORAGE_KEY = "cecm-admission-draft-v1";
export const ADMISSION_SESSION_KEY = "cecm-admission-session-v1";
export const ADMISSION_TOTAL_STEPS = 5;

export const ADMISSION_GRADES = [
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
  "image/jpg",
  "image/png",
  "image/webp",
];

export const MAX_DOCUMENT_SIZE_BYTES = 10 * 1024 * 1024;

export const ADMISSION_STEP_FIELDS = {
  1: [
    "personal.firstName",
    "personal.lastName",
    "personal.nationalId",
    "personal.birthDate",
    "personal.phone",
    "personal.address",
  ],
  2: [
    "academic.grade",
    "academic.shift",
    "academic.sameSchool",
    "academic.previousSchool",
    "academic.previousAverage",
    "academic.repeatedGrade",
  ],
  3: [
    "tutor.relationship",
    "tutor.firstName",
    "tutor.lastName",
    "tutor.nationalId",
    "tutor.phone",
    "tutor.email",
    "tutor.occupation",
    "tutor.address",
  ],
  4: ["documents.birthCertificate", "documents.idPhoto", "documents.representativeId"],
} as const;
