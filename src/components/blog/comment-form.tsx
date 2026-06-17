"use client";

import { submitCommentAction } from "@/app/actions/comments";
import Link from "next/link";
import { useState, useTransition } from "react";

interface CommentFormProps {
  postId: string;
  isAuthenticated: boolean;
}

export function CommentForm({ postId, isAuthenticated }: CommentFormProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isAuthenticated) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-6 text-center">
        <p className="text-sm text-zinc-600">
          <Link href="/login" className="font-medium text-emerald-700 hover:underline">
            Inicia sesión
          </Link>{" "}
          para dejar un comentario.
        </p>
      </div>
    );
  }

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
      <div>
        <label htmlFor="content" className="sr-only">
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

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {success && (
        <p className="text-sm text-emerald-700">
          Comentario enviado. Será visible tras la moderación.
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:opacity-50"
      >
        {isPending ? "Enviando..." : "Publicar comentario"}
      </button>
    </form>
  );
}
