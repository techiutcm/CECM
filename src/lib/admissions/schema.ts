import type { AdmissionFormValues } from "@/lib/admissions/types";
import { z } from "zod";
import {
  ADMISSION_GRADES,
  ADMISSION_SHIFTS,
  MAX_DOCUMENT_SIZE_BYTES,
  TUTOR_RELATIONSHIPS,
} from "@/lib/admissions/constants";

const nameField = z
  .string()
  .trim()
  .min(2, "Ingresa al menos 2 caracteres")
  .max(80, "Máximo 80 caracteres");

const nationalIdField = z
  .string()
  .trim()
  .min(6, "Ingresa una cédula válida")
  .max(12, "Máximo 12 caracteres")
  .regex(/^[VEJPG]-?\d{6,9}$/i, "Formato: V-12345678");

const phoneField = z
  .string()
  .trim()
  .min(10, "Ingresa un teléfono válido")
  .max(20, "Máximo 20 caracteres")
  .regex(/^[\d\s+()-]+$/, "Solo números y símbolos de teléfono");

export const uploadedDocumentSchema = z.object({
  url: z.string().url(),
  path: z.string().min(1),
  fileName: z.string().min(1),
  mimeType: z.string().min(1),
  size: z.number().max(MAX_DOCUMENT_SIZE_BYTES),
});

export const personalStepSchema = z.object({
  firstName: nameField,
  lastName: nameField,
  nationalId: nationalIdField,
  birthDate: z
    .string()
    .min(1, "Selecciona la fecha de nacimiento")
    .refine((value) => !Number.isNaN(Date.parse(value)), "Fecha inválida"),
  phone: phoneField,
  address: z.string().trim().min(8, "Ingresa la dirección completa").max(200),
});

export const academicStepSchema = z
  .object({
    grade: z
      .string()
      .min(1, "Selecciona el grado")
      .pipe(z.enum(ADMISSION_GRADES)),
    shift: z
      .string()
      .min(1, "Selecciona el turno")
      .pipe(z.enum(ADMISSION_SHIFTS)),
    sameSchool: z.boolean(),
    previousSchool: z.string().trim().optional(),
    previousAverage: z.string().trim().optional(),
    repeatedGrade: z
      .string()
      .min(1, "Selecciona una opción")
      .pipe(z.enum(["yes", "no"])),
  })
  .superRefine((data, ctx) => {
    if (!data.sameSchool) {
      if (!data.previousSchool?.trim()) {
        ctx.addIssue({
          code: "custom",
          path: ["previousSchool"],
          message: "Ingresa la escuela de procedencia",
        });
      }
      if (!data.previousAverage?.trim()) {
        ctx.addIssue({
          code: "custom",
          path: ["previousAverage"],
          message: "Ingresa el promedio de procedencia",
        });
      } else if (!/^\d{1,2}([.,]\d{1,2})?$/.test(data.previousAverage)) {
        ctx.addIssue({
          code: "custom",
          path: ["previousAverage"],
          message: "Promedio inválido (ej: 18.5)",
        });
      }
    }
  });

export const tutorStepSchema = z.object({
  relationship: z
    .string()
    .min(1, "Selecciona la relación")
    .pipe(z.enum(TUTOR_RELATIONSHIPS)),
  firstName: nameField,
  lastName: nameField,
  nationalId: nationalIdField,
  phone: phoneField,
  email: z.string().trim().email("Correo electrónico inválido"),
  occupation: z.string().trim().min(2, "Ingresa la ocupación").max(100),
  address: z.string().trim().min(8, "Ingresa la dirección completa").max(200),
});

export const documentsStepSchema = z.object({
  birthCertificate: uploadedDocumentSchema,
  idPhoto: uploadedDocumentSchema,
  representativeId: uploadedDocumentSchema,
});

const documentKeys = ["birthCertificate", "idPhoto", "representativeId"] as const;

export const documentsFormSchema = z
  .object({
    birthCertificate: uploadedDocumentSchema.optional(),
    idPhoto: uploadedDocumentSchema.optional(),
    representativeId: uploadedDocumentSchema.optional(),
  })
  .superRefine((data, ctx) => {
    documentKeys.forEach((key) => {
      if (!data[key]) {
        ctx.addIssue({
          code: "custom",
          path: [key],
          message: "Debes cargar este documento",
        });
      }
    });
  });

export const admissionFormSchema = z.object({
  personal: personalStepSchema,
  academic: academicStepSchema,
  tutor: tutorStepSchema,
  documents: documentsFormSchema,
});

export type AdmissionFormSchema = z.infer<typeof admissionFormSchema>;

export const admissionSubmitSchema = z.object({
  personal: personalStepSchema,
  academic: academicStepSchema,
  tutor: tutorStepSchema,
  documents: documentsStepSchema,
});

export const admissionStepSchemas = {
  1: z.object({ personal: personalStepSchema }),
  2: z.object({ academic: academicStepSchema }),
  3: z.object({ tutor: tutorStepSchema }),
  4: z.object({ documents: documentsFormSchema }),
} as const;

export type AdmissionSubmitData = z.infer<typeof admissionSubmitSchema>;

export function getDefaultAdmissionValues(): AdmissionFormValues {
  return {
    personal: {
      firstName: "",
      lastName: "",
      nationalId: "",
      birthDate: "",
      phone: "",
      address: "",
    },
    academic: {
      grade: "",
      shift: "",
      sameSchool: false,
      previousSchool: "",
      previousAverage: "",
      repeatedGrade: "",
    },
    tutor: {
      relationship: "",
      firstName: "",
      lastName: "",
      nationalId: "",
      phone: "",
      email: "",
      occupation: "",
      address: "",
    },
    documents: {
      birthCertificate: undefined,
      idPhoto: undefined,
      representativeId: undefined,
    },
  };
}
