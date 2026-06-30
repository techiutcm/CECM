"use client";

import { FormField } from "@/components/admissions/form-field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  getPerformanceHelperText,
  getPerformanceScale,
  LITERAL_PERFORMANCE_VALUES,
} from "@/lib/admissions/academic-performance";
import type { AdmissionFormValues } from "@/lib/admissions/types";
import { GraduationCap } from "lucide-react";
import { useEffect, useRef } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";

export function AcademicPerformanceField() {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext<AdmissionFormValues>();

  const grade = useWatch({ control, name: "academic.grade" });
  const performance = useWatch({ control, name: "academic.academicPerformance" });
  const legacyAverage = useWatch({ control, name: "academic.previousAverage" });
  const scale = getPerformanceScale(grade);
  const previousScaleRef = useRef<ReturnType<typeof getPerformanceScale>>(null);

  useEffect(() => {
    if (!performance && legacyAverage) {
      setValue("academic.academicPerformance", legacyAverage, { shouldValidate: false });
    }
  }, [legacyAverage, performance, setValue]);

  useEffect(() => {
    if (previousScaleRef.current && previousScaleRef.current !== scale) {
      setValue("academic.academicPerformance", "", {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
    previousScaleRef.current = scale;
  }, [scale, setValue]);

  const fieldError = errors.academic?.academicPerformance?.message;
  const isDisabled = !scale;

  return (
    <FormField
      label="Rendimiento Académico"
      htmlFor="academic.academicPerformance"
      error={fieldError}
      icon={GraduationCap}
    >
      <Controller
        key={scale ?? "unset"}
        name="academic.academicPerformance"
        control={control}
        render={({ field }) =>
          scale === "literal" ? (
            <Select
              id="academic.academicPerformance"
              disabled={isDisabled}
              value={field.value ?? ""}
              onChange={field.onChange}
              onBlur={field.onBlur}
            >
              <option value="" disabled>
                Seleccione
              </option>
              {LITERAL_PERFORMANCE_VALUES.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </Select>
          ) : (
            <Input
              id="academic.academicPerformance"
              type="number"
              min={10}
              max={20}
              step={0.1}
              inputMode="decimal"
              placeholder="10 - 20"
              disabled={isDisabled}
              value={field.value ?? ""}
              onChange={field.onChange}
              onBlur={field.onBlur}
            />
          )
        }
      />

      <p className="font-montserrat text-xs text-[#083148]/55">
        {getPerformanceHelperText(scale)}
      </p>
    </FormField>
  );
}
