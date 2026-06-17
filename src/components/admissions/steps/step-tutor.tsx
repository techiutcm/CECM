"use client";

import { FormField } from "@/components/admissions/form-field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { TUTOR_RELATIONSHIPS } from "@/lib/admissions/constants";
import type { AdmissionFormValues } from "@/lib/admissions/types";
import { Briefcase, Hash, Home, Mail, Phone, User, Users } from "lucide-react";
import { useFormContext } from "react-hook-form";

export function StepTutor() {
  const {
    register,
    formState: { errors },
  } = useFormContext<AdmissionFormValues>();

  return (
    <div className="space-y-6">
      <header>
        <h2 className="font-bebas text-3xl uppercase tracking-wide text-[#083148] sm:text-4xl">
          Información del Padre, Madre o Representante
        </h2>
        <p className="font-montserrat mt-2 text-sm text-[#083148]/70 sm:text-base">
          Datos de contacto del representante responsable del estudiante.
        </p>
      </header>

      <FormField
        label="Relación con el Estudiante"
        htmlFor="tutor.relationship"
        error={errors.tutor?.relationship?.message}
        icon={Users}
      >
        <Select id="tutor.relationship" defaultValue="" {...register("tutor.relationship")}>
          <option value="" disabled>
            Seleccione
          </option>
          {TUTOR_RELATIONSHIPS.map((relationship) => (
            <option key={relationship} value={relationship}>
              {relationship}
            </option>
          ))}
        </Select>
      </FormField>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Nombres" htmlFor="tutor.firstName" error={errors.tutor?.firstName?.message} icon={User}>
          <Input id="tutor.firstName" {...register("tutor.firstName")} />
        </FormField>

        <FormField label="Apellidos" htmlFor="tutor.lastName" error={errors.tutor?.lastName?.message} icon={User}>
          <Input id="tutor.lastName" {...register("tutor.lastName")} />
        </FormField>

        <FormField label="Cédula" htmlFor="tutor.nationalId" error={errors.tutor?.nationalId?.message} icon={Hash}>
          <Input id="tutor.nationalId" placeholder="V-12345678" {...register("tutor.nationalId")} />
        </FormField>

        <FormField label="Teléfono" htmlFor="tutor.phone" error={errors.tutor?.phone?.message} icon={Phone}>
          <Input id="tutor.phone" type="tel" {...register("tutor.phone")} />
        </FormField>

        <FormField label="Correo" htmlFor="tutor.email" error={errors.tutor?.email?.message} icon={Mail}>
          <Input id="tutor.email" type="email" autoComplete="email" {...register("tutor.email")} />
        </FormField>

        <FormField label="Ocupación" htmlFor="tutor.occupation" error={errors.tutor?.occupation?.message} icon={Briefcase}>
          <Input id="tutor.occupation" {...register("tutor.occupation")} />
        </FormField>

        <FormField
          label="Dirección de Habitación"
          htmlFor="tutor.address"
          error={errors.tutor?.address?.message}
          icon={Home}
          className="sm:col-span-2"
        >
          <Input id="tutor.address" {...register("tutor.address")} />
        </FormField>
      </div>
    </div>
  );
}
