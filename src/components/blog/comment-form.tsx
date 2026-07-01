"use client";

import { submitCommentAction } from "@/app/actions/comments";
import { useState, useTransition } from "react";

interface CommentFormProps {
  postId: string;
}

export function CommentForm({ postId }: CommentFormProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function handleSubmit(formData: FormData) {
    setError(null);
    setSuccess(false);

    startTransition(async () => {
      const result = await submitCommentAction(postId, formData);
      if (result?.error) {
        setError(result.error);
        return;
      }
      setSuccess(true);
      (document.getElementById("comment-form") as HTMLFormElement)?.reset();
    });
  }

  return (
    <form id="comment-form" action={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="guest_name" className="mb-1.5 block text-sm font-medium text-zinc-700">
            Nombre
          </label>
          <input
            id="guest_name"
            name="guest_name"
            type="text"
            required
            autoComplete="name"
            placeholder="Tu nombre"
            className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>

        <div>
          <label htmlFor="guest_email" className="mb-1.5 block text-sm font-medium text-zinc-700">
            Correo <span className="font-normal text-zinc-400">(opcional)</span>
          </label>
          <input
            id="guest_email"
            name="guest_email"
            type="email"
            autoComplete="email"
            placeholder="tu@correo.com"
            className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>
      </div>

      <div>
        <label htmlFor="content" className="mb-1.5 block text-sm font-medium text-zinc-700">
          Comentario
        </label>
        <textarea
          id="content"
          name="content"
          required
          rows={4}
          placeholder="Escribe tu comentario..."
          className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
        />
      </div>

      <p className="text-xs text-zinc-500">
        Tu comentario será revisado por nuestro equipo antes de publicarse.
      </p>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {success && (
        <p className="text-sm text-emerald-700">
          Comentario enviado. Está pendiente de aprobación y aparecerá cuando sea moderado.
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:opacity-50"
      >
        {isPending ? "Enviando..." : "Enviar comentario"}
      </button>
    </form>
  );
}
