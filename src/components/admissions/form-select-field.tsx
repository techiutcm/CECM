"use client";

import { FormField } from "@/components/admissions/form-field";
import { Select } from "@/components/ui/select";
import type { AdmissionFormValues } from "@/lib/admissions/types";
import type { LucideIcon } from "lucide-react";
import { Controller, useFormContext, type FieldPath } from "react-hook-form";

export interface FormSelectOption {
  value: string;
  label: string;
}

interface FormSelectFieldProps {
  name: FieldPath<AdmissionFormValues>;
  id: string;
  label: string;
  placeholder?: string;
  options: readonly FormSelectOption[] | readonly string[];
  error?: string;
  icon?: LucideIcon;
  className?: string;
}

function normalizeOptions(options: readonly FormSelectOption[] | readonly string[]) {
  return options.map((option) =>
    typeof option === "string" ? { value: option, label: option } : option,
  );
}

export function FormSelectField({
  name,
  id,
  label,
  placeholder = "Seleccione",
  options,
  error,
  icon,
  className,
}: FormSelectFieldProps) {
  const { control } = useFormContext<AdmissionFormValues>();
  const normalizedOptions = normalizeOptions(options);

  return (
    <FormField label={label} htmlFor={id} error={error} icon={icon} className={className}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select
            id={id}
            value={typeof field.value === "string" ? field.value : ""}
            onChange={(event) => field.onChange(event.target.value)}
            onBlur={field.onBlur}
          >
            <option value="" disabled>
              {placeholder}
            </option>
            {normalizedOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        )}
      />
    </FormField>
  );
}
