"use client";

import { FormField } from "@/components/admissions/form-field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  getStudentNationalIdHelperText,
  getTutorNationalIdHelperText,
  NATIONAL_ID_PREFIXES,
  parseNationalId,
} from "@/lib/admissions/national-id";
import type { AdmissionFormValues, NationalIdPrefix } from "@/lib/admissions/types";
import { Hash } from "lucide-react";
import { useEffect } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";

type NationalIdScope = "personal" | "tutor";

interface NationalIdFieldProps {
  scope: NationalIdScope;
  label?: string;
}

function getFieldPaths(scope: NationalIdScope) {
  return {
    prefix: `${scope}.nationalIdPrefix` as const,
    number: `${scope}.nationalIdNumber` as const,
    legacy: `${scope}.nationalId` as const,
  };
}

export function NationalIdField({ scope, label = "Cédula" }: NationalIdFieldProps) {
  const paths = getFieldPaths(scope);
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext<AdmissionFormValues>();

  const grade = useWatch({ control, name: "academic.grade" });
  const legacyNationalId = useWatch({ control, name: paths.legacy });
  const prefix = useWatch({ control, name: paths.prefix });
  const number = useWatch({ control, name: paths.number });

  const scopeErrors = scope === "personal" ? errors.personal : errors.tutor;

  useEffect(() => {
    if ((prefix || number) || !legacyNationalId) return;

    const parsed = parseNationalId(legacyNationalId);
    setValue(paths.prefix, parsed.prefix as NationalIdPrefix, { shouldValidate: false });
    setValue(paths.number, parsed.number, { shouldValidate: false });
  }, [legacyNationalId, number, paths.number, paths.prefix, prefix, setValue]);

  const fieldError = scopeErrors?.nationalIdNumber?.message || scopeErrors?.nationalIdPrefix?.message;
  const helperText =
    scope === "personal"
      ? getStudentNationalIdHelperText(grade)
      : getTutorNationalIdHelperText();

  return (
    <FormField
      label={label}
      htmlFor={paths.number}
      error={fieldError}
      icon={Hash}
    >
      <div className="flex gap-2">
        <Controller
          name={paths.prefix}
          control={control}
          render={({ field }) => (
            <Select
              id={paths.prefix}
              aria-label="Prefijo de nacionalidad"
              className="w-24 shrink-0"
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
            >
              {NATIONAL_ID_PREFIXES.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </Select>
          )}
        />

        <Controller
          name={paths.number}
          control={control}
          render={({ field }) => (
            <Input
              id={paths.number}
              placeholder={scope === "personal" ? "12345678 o provisional" : "12345678"}
              autoComplete="off"
              className="min-w-0 flex-1"
              value={field.value ?? ""}
              onChange={field.onChange}
              onBlur={field.onBlur}
            />
          )}
        />
      </div>

      <p className="font-montserrat text-xs text-[#083148]/55">{helperText}</p>
    </FormField>
  );
}

export function StudentNationalIdField() {
  return <NationalIdField scope="personal" />;
}

export function TutorNationalIdField() {
  return <NationalIdField scope="tutor" />;
}
