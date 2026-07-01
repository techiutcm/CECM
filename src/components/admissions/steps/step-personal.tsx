"use client";

import { BirthDateField } from "@/components/admissions/birth-date-field";
import { FormField } from "@/components/admissions/form-field";
import { StudentNationalIdField } from "@/components/admissions/national-id-field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  MATERNAL_CARE_GRADE,
  MATERNAL_CARE_SHIFT,
  shouldHideStudentNationalId,
} from "@/lib/admissions/maternal-care";
import type { AdmissionFormValues } from "@/lib/admissions/types";
import { Calendar, Home, Phone, User } from "lucide-react";
import { useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";

export function StepPersonal() {
  const {
    register,
    setValue,
    getValues,
    clearErrors,
    formState: { errors },
  } = useFormContext<AdmissionFormValues>();

  const maternalCare = useWatch({ name: "personal.maternalCare" });
  const hideStudentNationalId = shouldHideStudentNationalId(maternalCare);

  useEffect(() => {
    if (maternalCare === "yes") {
      setValue("academic.grade", MATERNAL_CARE_GRADE, { shouldDirty: true, shouldValidate: true });
      setValue("academic.shift", MATERNAL_CARE_SHIFT, { shouldDirty: true, shouldValidate: true });
      setValue("personal.nationalIdPrefix", "V", { shouldDirty: true });
      setValue("personal.nationalIdNumber", "", { shouldDirty: true });
      setValue("personal.nationalId", "", { shouldDirty: true });
      setValue("academic.provenance", "", { shouldDirty: true });
      setValue("academic.previousSchool", "", { shouldDirty: true });
      setValue("academic.academicPerformance", "", { shouldDirty: true });
      setValue("academic.repeatedGrade", "no", { shouldDirty: true });
      clearErrors([
        "personal.nationalIdPrefix",
        "personal.nationalIdNumber",
        "academic.provenance",
        "academic.previousSchool",
        "academic.academicPerformance",
        "academic.repeatedGrade",
      ]);
      return;
    }

    if (maternalCare === "no" && getValues("academic.grade") === MATERNAL_CARE_GRADE) {
      setValue("academic.grade", "", { shouldDirty: true, shouldValidate: true });
      setValue("academic.shift", "", { shouldDirty: true, shouldValidate: true });
    }
  }, [maternalCare, setValue, clearErrors, getValues]);

  return (
    <div className="space-y-6">
      <header>
        <h2 className="font-bebas text-3xl uppercase tracking-wide text-[#083148] sm:text-4xl">
          Información del Estudiante
        </h2>
        <p className="font-montserrat mt-2 text-sm text-[#083148]/70 sm:text-base">
          Datos personales del aspirante a ingresar al complejo educativo.
        </p>
      </header>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Nombres" htmlFor="personal.firstName" error={errors.personal?.firstName?.message} icon={User}>
          <Input id="personal.firstName" autoComplete="given-name" {...register("personal.firstName")} />
        </FormField>

        <FormField label="Apellidos" htmlFor="personal.lastName" error={errors.personal?.lastName?.message} icon={User}>
          <Input id="personal.lastName" autoComplete="family-name" {...register("personal.lastName")} />
        </FormField>

        {!hideStudentNationalId && <StudentNationalIdField />}

        <FormField
          label="Fecha de Nacimiento"
          htmlFor="personal.birthDate"
          error={errors.personal?.birthDate?.message}
          icon={Calendar}
        >
          <BirthDateField />
        </FormField>

        <FormField label="Teléfono" htmlFor="personal.phone" error={errors.personal?.phone?.message} icon={Phone}>
          <Input id="personal.phone" type="tel" autoComplete="tel" placeholder="0414-1234567" {...register("personal.phone")} />
        </FormField>

        <FormField label="Dirección de Habitación" htmlFor="personal.address" error={errors.personal?.address?.message} icon={Home} className="sm:col-span-2">
          <Input id="personal.address" autoComplete="street-address" {...register("personal.address")} />
        </FormField>
      </div>

      <fieldset className="space-y-3 rounded-2xl border border-[#083148]/10 bg-white/60 p-4">
        <Label>Cuidado Maternal</Label>
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 font-montserrat text-sm text-[#083148]">
            <input type="radio" value="yes" {...register("personal.maternalCare")} />
            Sí
          </label>
          <label className="flex items-center gap-2 font-montserrat text-sm text-[#083148]">
            <input type="radio" value="no" {...register("personal.maternalCare")} />
            No
          </label>
        </div>
        {errors.personal?.maternalCare?.message && (
          <p className="font-montserrat text-xs font-medium text-[#DB2B2C]">
            {errors.personal.maternalCare.message}
          </p>
        )}
      </fieldset>
    </div>
  );
}
