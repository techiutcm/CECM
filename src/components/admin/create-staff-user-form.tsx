"use client";

import { createStaffUserAction } from "@/app/admin/actions/staff-users";
import { STAFF_PANEL_CONFIG, type StaffPanel } from "@/types/staff";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

interface CreateStaffUserFormProps {
  panel: StaffPanel;
}

export function CreateStaffUserForm({ panel }: CreateStaffUserFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const config = STAFF_PANEL_CONFIG[panel];
  const formId = `create-staff-user-${panel}`;

  function handleSubmit(formData: FormData) {
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      const result = await createStaffUserAction(formData);

      if (result?.error) {
        setError(result.error);
        return;
      }

      setSuccess(result.message ?? "Usuario creado correctamente");
      router.refresh();
      (document.getElementById(formId) as HTMLFormElement)?.reset();
    });
  }

  return (
    <form id={formId} action={handleSubmit} className="grid gap-4 sm:grid-cols-2">
      <input type="hidden" name="panel" value={panel} />

      <div className="space-y-1 sm:col-span-2">
        <label htmlFor={`${panel}-email`} className="text-sm font-medium text-zinc-700">
          Correo electrónico
        </label>
        <input
          id={`${panel}-email`}
          name="email"
          type="email"
          required
          autoComplete="off"
          placeholder="usuario@colegio.com"
          className="h-10 w-full rounded-lg border border-zinc-200 px-3 text-sm outline-none focus:border-emerald-500"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor={`${panel}-password`} className="text-sm font-medium text-zinc-700">
          Contraseña temporal
        </label>
        <input
          id={`${panel}-password`}
          name="password"
          type="password"
          required
          minLength={6}
          autoComplete="new-password"
          placeholder="Mínimo 6 caracteres"
          className="h-10 w-full rounded-lg border border-zinc-200 px-3 text-sm outline-none focus:border-emerald-500"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor={`${panel}-full_name`} className="text-sm font-medium text-zinc-700">
          Nombre completo
        </label>
        <input
          id={`${panel}-full_name`}
          name="full_name"
          required
          defaultValue={config.defaultName}
          className="h-10 w-full rounded-lg border border-zinc-200 px-3 text-sm outline-none focus:border-emerald-500"
        />
      </div>

      <div className="space-y-1 sm:col-span-2">
        <label htmlFor={`${panel}-title`} className="text-sm font-medium text-zinc-700">
          Cargo
        </label>
        <input
          id={`${panel}-title`}
          name="title"
          required
          defaultValue={config.defaultTitle}
          className="h-10 w-full rounded-lg border border-zinc-200 px-3 text-sm outline-none focus:border-emerald-500"
        />
      </div>

      <div className="sm:col-span-2">
        <p className="mb-3 text-xs text-zinc-500">
          Se asignará el rol <strong>{config.role}</strong> y el departamento{" "}
          <strong>{config.department}</strong>.
        </p>
        <button
          type="submit"
          disabled={isPending}
          className="h-10 rounded-lg bg-emerald-700 px-5 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-50"
        >
          {isPending ? "Creando usuario..." : "Crear usuario"}
        </button>
      </div>

      {error && <p className="sm:col-span-2 text-sm text-red-600">{error}</p>}
      {success && <p className="sm:col-span-2 text-sm text-emerald-700">{success}</p>}
    </form>
  );
}
