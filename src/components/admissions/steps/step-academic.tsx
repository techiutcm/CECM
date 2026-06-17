"use client";

import { FormField } from "@/components/admissions/form-field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import {
  ADMISSION_GRADES,
  ADMISSION_SHIFTS,
} from "@/lib/admissions/constants";
import type { AdmissionFormValues } from "@/lib/admissions/types";
import { GraduationCap, School } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";

export function StepAcademic() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<AdmissionFormValues>();

  const sameSchool = useWatch({ control, name: "academic.sameSchool" });

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
        <FormField label="Grado a cursar" htmlFor="academic.grade" error={errors.academic?.grade?.message} icon={GraduationCap}>
          <Select id="academic.grade" defaultValue="" {...register("academic.grade")}>
            <option value="" disabled>
              Seleccione
            </option>
            {ADMISSION_GRADES.map((grade) => (
              <option key={grade} value={grade}>
                {grade}
              </option>
            ))}
          </Select>
        </FormField>

        <FormField label="Turno" htmlFor="academic.shift" error={errors.academic?.shift?.message} icon={School}>
          <Select id="academic.shift" defaultValue="" {...register("academic.shift")}>
            <option value="" disabled>
              Seleccione
            </option>
            {ADMISSION_SHIFTS.map((shift) => (
              <option key={shift} value={shift}>
                {shift}
              </option>
            ))}
          </Select>
        </FormField>
      </div>

      <label className="flex items-start gap-3 rounded-2xl border border-[#083148]/10 bg-white/70 p-4">
        <input
          type="checkbox"
          className="mt-1 h-4 w-4 rounded border-[#083148]/20 text-[#083148] focus:ring-[#083148]/20"
          {...register("academic.sameSchool")}
        />
        <span>
          <span className="font-montserrat block text-sm font-semibold text-[#083148]">
            Procede del mismo colegio
          </span>
          <span className="font-montserrat mt-1 block text-sm text-[#083148]/65">
            Si marca esta opción, no necesitamos la escuela ni el promedio de procedencia.
          </span>
        </span>
      </label>

      {!sameSchool && (
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

          <FormField
            label="Promedio de Procedencia"
            htmlFor="academic.previousAverage"
            error={errors.academic?.previousAverage?.message}
            icon={GraduationCap}
          >
            <Input id="academic.previousAverage" placeholder="18.5" {...register("academic.previousAverage")} />
          </FormField>
        </div>
      )}

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
