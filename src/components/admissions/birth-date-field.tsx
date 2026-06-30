"use client";

import { Input } from "@/components/ui/input";
import {
  displayToIso,
  formatBirthDateInput,
  getBirthDateBounds,
  getBirthDateHelperText,
  isoToDisplay,
} from "@/lib/admissions/birth-date";
import type { AdmissionFormValues } from "@/lib/admissions/types";
import { cn } from "@/lib/utils";
import { Calendar } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";

interface BirthDateFieldProps {
  id?: string;
  className?: string;
}

export function BirthDateField({ id = "personal.birthDate", className }: BirthDateFieldProps) {
  const { setValue, control } = useFormContext<AdmissionFormValues>();
  const calendarInputRef = useRef<HTMLInputElement>(null);
  const calendarId = useId();
  const bounds = getBirthDateBounds();

  const isoValue = useWatch({ control, name: "personal.birthDate" });
  const [displayValue, setDisplayValue] = useState(() => isoToDisplay(isoValue ?? ""));

  useEffect(() => {
    setDisplayValue(isoToDisplay(isoValue ?? ""));
  }, [isoValue]);

  function syncFromDisplay(nextDisplay: string) {
    setDisplayValue(nextDisplay);

    if (nextDisplay.length < 10) {
      setValue("personal.birthDate", "", {
        shouldDirty: true,
        shouldValidate: true,
      });
      return;
    }

    const iso = displayToIso(nextDisplay);
    setValue("personal.birthDate", iso ?? "", {
      shouldDirty: true,
      shouldValidate: true,
    });
  }

  function handleTextChange(raw: string) {
    syncFromDisplay(formatBirthDateInput(raw));
  }

  function handleCalendarChange(iso: string) {
    setValue("personal.birthDate", iso, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setDisplayValue(isoToDisplay(iso));
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div className="relative flex items-center gap-2">
        <Input
          id={id}
          value={displayValue}
          onChange={(event) => handleTextChange(event.target.value)}
          placeholder="DD/MM/AAAA"
          inputMode="numeric"
          autoComplete="bday"
          maxLength={10}
          aria-describedby={`${id}-helper`}
          className="pr-12"
        />

        <input
          ref={calendarInputRef}
          id={calendarId}
          type="date"
          min={bounds.minIso}
          max={bounds.maxIso}
          value={isoValue || ""}
          onChange={(event) => {
            if (event.target.value) {
              handleCalendarChange(event.target.value);
            }
          }}
          className="sr-only"
          tabIndex={-1}
        />

        <button
          type="button"
          onClick={() => {
            calendarInputRef.current?.showPicker?.();
            calendarInputRef.current?.focus();
          }}
          className="absolute right-2 inline-flex h-8 w-8 items-center justify-center rounded-lg text-[#083148]/55 transition hover:bg-[#083148]/5 hover:text-[#083148]"
          aria-label="Abrir selector de fecha"
        >
          <Calendar className="h-4 w-4" />
        </button>
      </div>

      <p id={`${id}-helper`} className="font-montserrat text-xs text-[#083148]/55">
        {getBirthDateHelperText()}
      </p>
    </div>
  );
}
