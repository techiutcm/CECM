"use client";

import { FormField } from "@/components/admissions/form-field";
import { Input } from "@/components/ui/input";
import type { AdmissionFormValues } from "@/lib/admissions/types";
import { Calendar, Hash, Home, Phone, User } from "lucide-react";
import { useFormContext } from "react-hook-form";

export function StepPersonal() {
  const {
    register,
    formState: { errors },
  } = useFormContext<AdmissionFormValues>();

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

        <FormField label="Cédula" htmlFor="personal.nationalId" error={errors.personal?.nationalId?.message} icon={Hash}>
          <Input id="personal.nationalId" placeholder="V-12345678" {...register("personal.nationalId")} />
        </FormField>

        <FormField label="Fecha de Nacimiento" htmlFor="personal.birthDate" error={errors.personal?.birthDate?.message} icon={Calendar}>
          <Input id="personal.birthDate" type="date" {...register("personal.birthDate")} />
        </FormField>

        <FormField label="Teléfono" htmlFor="personal.phone" error={errors.personal?.phone?.message} icon={Phone}>
          <Input id="personal.phone" type="tel" autoComplete="tel" placeholder="0414-1234567" {...register("personal.phone")} />
        </FormField>

        <FormField label="Dirección de Habitación" htmlFor="personal.address" error={errors.personal?.address?.message} icon={Home} className="sm:col-span-2">
          <Input id="personal.address" autoComplete="street-address" {...register("personal.address")} />
        </FormField>
      </div>
    </div>
  );
}
