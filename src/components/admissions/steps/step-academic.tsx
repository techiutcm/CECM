"use client";

import { AcademicPerformanceField } from "@/components/admissions/academic-performance-field";
import { FormField } from "@/components/admissions/form-field";
import { FormSelectField } from "@/components/admissions/form-select-field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ADMISSION_GRADES,
  ADMISSION_PROVENANCE_LABELS,
  ADMISSION_PROVENANCE_VALUES,
} from "@/lib/admissions/constants";
import { ADMISSION_SHIFT_OPTIONS } from "@/lib/admissions/shifts";
import type { AdmissionFormValues } from "@/lib/admissions/types";
import { Globe, GraduationCap, School } from "lucide-react";
import { useFormContext } from "react-hook-form";

export function StepAcademic() {
  const {
    register,
    formState: { errors },
  } = useFormContext<AdmissionFormValues>();

  return (
    <div className="space-y-6">
      <header>
        <h2 className="font-bebas text-3xl uppercase tracking-wide text-[#083148] sm:text-4xl">
          Información Escolar del Estudiante
        </h2>
        <p className="font-montserrat mt-2 text-sm text-[#083148]/70 sm:text-base">
          Cuéntanos el grado que cursará y su trayectoria académica.
        </p>
      </header>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormSelectField
          name="academic.grade"
          id="academic.grade"
          label="Grado a cursar"
          placeholder="Seleccione el grado"
          options={ADMISSION_GRADES}
          error={errors.academic?.grade?.message}
          icon={GraduationCap}
        />

        <FormSelectField
          name="academic.shift"
          id="academic.shift"
          label="Turno"
          placeholder="Seleccione el turno"
          options={ADMISSION_SHIFT_OPTIONS}
          error={errors.academic?.shift?.message}
          icon={School}
        />

        <FormSelectField
          name="academic.provenance"
          id="academic.provenance"
          label="Procedencia"
          placeholder="Seleccione la procedencia"
          options={ADMISSION_PROVENANCE_VALUES.map((value) => ({
            value,
            label: ADMISSION_PROVENANCE_LABELS[value],
          }))}
          error={errors.academic?.provenance?.message}
          icon={Globe}
          className="sm:col-span-2"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField
          label="Escuela de Procedencia"
          htmlFor="academic.previousSchool"
          error={errors.academic?.previousSchool?.message}
          icon={School}
          className="sm:col-span-2"
        >
          <Input id="academic.previousSchool" {...register("academic.previousSchool")} />
        </FormField>

        <AcademicPerformanceField />
      </div>

      <fieldset className="space-y-3">
        <Label>¿Repitió algún grado?</Label>
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 font-montserrat text-sm text-[#083148]">
            <input type="radio" value="yes" {...register("academic.repeatedGrade")} />
            Sí
          </label>
          <label className="flex items-center gap-2 font-montserrat text-sm text-[#083148]">
            <input type="radio" value="no" {...register("academic.repeatedGrade")} />
            No
          </label>
        </div>
        {errors.academic?.repeatedGrade?.message && (
          <p className="font-montserrat text-xs font-medium text-[#DB2B2C]">
            {errors.academic.repeatedGrade.message}
          </p>
        )}
      </fieldset>
    </div>
  );
}
