"use client";

import { createTagAction } from "@/app/admin/actions/tags";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export function CreateTagForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await createTagAction(formData);
      if (result?.error) {
        setError(result.error);
        return;
      }
      router.refresh();
      (document.getElementById("create-tag-form") as HTMLFormElement)?.reset();
    });
  }

  return (
    <form id="create-tag-form" action={handleSubmit} className="flex flex-wrap items-end gap-3">
      <div className="min-w-[200px] flex-1 space-y-1">
        <label htmlFor="tag-name" className="text-sm font-medium text-zinc-700">
          Nombre
        </label>
        <input
          id="tag-name"
          name="name"
          required
          placeholder="Tecnología"
          className="h-10 w-full rounded-lg border border-zinc-200 px-3 text-sm outline-none focus:border-emerald-500"
        />
      </div>
      <div className="min-w-[160px] flex-1 space-y-1">
        <label htmlFor="tag-slug" className="text-sm font-medium text-zinc-700">
          Slug (opcional)
        </label>
        <input
          id="tag-slug"
          name="slug"
          placeholder="tecnologia"
          className="h-10 w-full rounded-lg border border-zinc-200 px-3 text-sm outline-none focus:border-emerald-500"
        />
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="h-10 rounded-lg bg-emerald-700 px-4 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-50"
      >
        {isPending ? "Creando..." : "Crear etiqueta"}
      </button>
      {error && <p className="w-full text-sm text-red-600">{error}</p>}
    </form>
  );
}
