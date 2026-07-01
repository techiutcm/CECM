import { isMaternalCareEnabled, isMaternalGrade } from "@/lib/admissions/maternal-care";
import { normalizeAdmissionShift } from "@/lib/admissions/shifts";
import {
  normalizeAcademicPerformance,
  validateAcademicPerformance,
} from "@/lib/admissions/academic-performance";
import { normalizeBirthDateToIso, validateBirthDateIso } from "@/lib/admissions/birth-date";
import {
  formatNationalId,
  formatNationalIdDisplay,
  validateRequiredNationalId,
  validateStudentNationalId,
} from "@/lib/admissions/national-id";
import type { AdmissionFormValues } from "@/lib/admissions/types";
import { z } from "zod";
import {
  ADMISSION_GRADES,
  ADMISSION_PROVENANCE_VALUES,
  ADMISSION_SHIFTS,
  MAX_DOCUMENT_SIZE_BYTES,
  TUTOR_RELATIONSHIPS,
} from "@/lib/admissions/constants";

const nationalIdPrefixField = z.enum(["V", "E"], {
  message: "Selecciona el prefijo V o E",
});

const nameField = z
  .string()
  .trim()
  .min(2, "Ingresa al menos 2 caracteres")
  .max(80, "Máximo 80 caracteres");


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

export const personalStepSchema = z
  .object({
    firstName: nameField,
    lastName: nameField,
    maternalCare: z
      .string()
      .min(1, "Selecciona una opción")
      .pipe(z.enum(["yes", "no"])),
    nationalIdPrefix: nationalIdPrefixField,
    nationalIdNumber: z.string().trim(),
    nationalId: z.string().trim().optional(),
    birthDate: z
      .string()
      .min(1, "Ingresa la fecha de nacimiento")
      .transform((value) => normalizeBirthDateToIso(value) ?? value),
    phone: phoneField,
    address: z.string().trim().min(8, "Ingresa la dirección completa").max(200),
  })
  .superRefine((data, ctx) => {
    const birthMessage = validateBirthDateIso(data.birthDate, {
      maternalCare: isMaternalCareEnabled(data.maternalCare),
    });

    if (birthMessage) {
      ctx.addIssue({
        code: "custom",
        path: ["birthDate"],
        message: birthMessage,
      });
    }

    if (isMaternalCareEnabled(data.maternalCare)) {
      return;
    }

    const message = validateStudentNationalId("", data.nationalIdPrefix, data.nationalIdNumber);
    if (message) {
      ctx.addIssue({
        code: "custom",
        path: ["nationalIdNumber"],
        message,
      });
    }
  })
  .transform((data) => ({
    ...data,
    nationalId: isMaternalCareEnabled(data.maternalCare)
      ? ""
      : formatNationalId(data.nationalIdPrefix, data.nationalIdNumber),
  }));

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
    provenance: z.string().trim().optional(),
    previousSchool: z.string().trim().optional(),
    academicPerformance: z.string().trim().optional(),
    repeatedGrade: z.string().trim().optional(),
  })
  .superRefine((data, ctx) => {
    if (isMaternalGrade(data.grade)) {
      return;
    }

    if (!data.provenance || !ADMISSION_PROVENANCE_VALUES.includes(data.provenance as (typeof ADMISSION_PROVENANCE_VALUES)[number])) {
      ctx.addIssue({
        code: "custom",
        path: ["provenance"],
        message: "Selecciona la procedencia",
      });
    }

    if (!data.previousSchool?.trim()) {
      ctx.addIssue({
        code: "custom",
        path: ["previousSchool"],
        message: "Ingresa la escuela de procedencia",
      });
    }

    const performanceValue =
      data.academicPerformance?.trim() || (data as { previousAverage?: string }).previousAverage?.trim() || "";
    const performanceError = validateAcademicPerformance(data.grade, performanceValue);

    if (performanceError) {
      ctx.addIssue({
        code: "custom",
        path: ["academicPerformance"],
        message: performanceError,
      });
    }

    if (data.repeatedGrade !== "yes" && data.repeatedGrade !== "no") {
      ctx.addIssue({
        code: "custom",
        path: ["repeatedGrade"],
        message: "Selecciona una opción",
      });
    }
  })
  .transform((data) => {
    if (isMaternalGrade(data.grade)) {
      return {
        ...data,
        shift: normalizeAdmissionShift(data.shift) || data.shift,
        provenance: data.provenance || "",
        previousSchool: "",
        academicPerformance: "",
        repeatedGrade: "no" as const,
      };
    }

    const raw =
      data.academicPerformance?.trim() ||
      (data as { previousAverage?: string }).previousAverage?.trim() ||
      "";
    const normalized = normalizeAcademicPerformance(data.grade, raw);
    const shift = normalizeAdmissionShift(data.shift);

    return {
      ...data,
      shift: shift || data.shift,
      academicPerformance: normalized ?? "",
    };
  });

export const tutorStepSchema = z
  .object({
    relationship: z
      .string()
      .min(1, "Selecciona la relación")
      .pipe(z.enum(TUTOR_RELATIONSHIPS)),
    firstName: nameField,
    lastName: nameField,
    nationalIdPrefix: nationalIdPrefixField,
    nationalIdNumber: z.string().trim(),
    nationalId: z.string().trim().optional(),
    phone: phoneField,
    email: z.string().trim().email("Correo electrónico inválido"),
    occupation: z.string().trim().min(2, "Ingresa la ocupación").max(100),
    address: z.string().trim().min(8, "Ingresa la dirección completa").max(200),
  })
  .superRefine((data, ctx) => {
    const message = validateRequiredNationalId(data.nationalIdPrefix, data.nationalIdNumber);
    if (message) {
      ctx.addIssue({
        code: "custom",
        path: ["nationalIdNumber"],
        message,
      });
    }
  })
  .transform((data) => ({
    ...data,
    nationalId: formatNationalId(data.nationalIdPrefix, data.nationalIdNumber),
  }));

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

export const admissionSubmitSchema = z
  .object({
    personal: personalStepSchema,
    academic: academicStepSchema,
    tutor: tutorStepSchema,
    documents: documentsStepSchema,
  })
  .superRefine((data, ctx) => {
    if (isMaternalCareEnabled(data.personal.maternalCare) || isMaternalGrade(data.academic.grade)) {
      const birthMessage = validateBirthDateIso(data.personal.birthDate, { maternalCare: true });
      if (birthMessage) {
        ctx.addIssue({
          code: "custom",
          path: ["personal", "birthDate"],
          message: birthMessage,
        });
      }
      return;
    }

    const birthMessage = validateBirthDateIso(data.personal.birthDate);
    if (birthMessage) {
      ctx.addIssue({
        code: "custom",
        path: ["personal", "birthDate"],
        message: birthMessage,
      });
    }

    const message = validateStudentNationalId(
      data.academic.grade,
      data.personal.nationalIdPrefix,
      data.personal.nationalIdNumber,
    );

    if (message) {
      ctx.addIssue({
        code: "custom",
        path: ["personal", "nationalIdNumber"],
        message,
      });
    }
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
      maternalCare: "",
      nationalIdPrefix: "V",
      nationalIdNumber: "",
      nationalId: "",
      birthDate: "",
      phone: "",
      address: "",
    },
    academic: {
      grade: "",
      shift: "",
      provenance: "",
      previousSchool: "",
      academicPerformance: "",
      repeatedGrade: "",
    },
    tutor: {
      relationship: "",
      firstName: "",
      lastName: "",
      nationalIdPrefix: "V",
      nationalIdNumber: "",
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
