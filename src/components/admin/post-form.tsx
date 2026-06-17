"use client";

import {
  createPostAction,
  deletePostAction,
  updatePostAction,
} from "@/app/admin/actions/posts";
import { TagSelector } from "@/components/admin/tag-selector";
import type { Post, PostStatus, Tag } from "@/types/blog";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

interface PostFormProps {
  post?: Post;
  tags: Tag[];
  isNew?: boolean;
}

const statusOptions: { value: PostStatus; label: string }[] = [
  { value: "draft", label: "Borrador" },
  { value: "published", label: "Publicado" },
  { value: "archived", label: "Archivado" },
];

export function PostForm({ post, tags, isNew = false }: PostFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function handleSubmit(formData: FormData) {
    setError(null);
    setSuccess(false);

    startTransition(async () => {
      const result = isNew
        ? await createPostAction(formData)
        : await updatePostAction(post!.id, formData);

      if (result && "error" in result && result.error) {
        setError(result.error);
        return;
      }

      if (!isNew) {
        setSuccess(true);
        router.refresh();
      }
    });
  }

  function handleDelete() {
    if (!post || !confirm("¿Eliminar este post permanentemente?")) return;

    startTransition(async () => {
      const result = await deletePostAction(post.id);
      if (result && "error" in result && result.error) {
        setError(result.error);
      }
    });
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium text-zinc-700">
            Título *
          </label>
          <input
            id="title"
            name="title"
            required
            defaultValue={post?.title}
            placeholder="Título del artículo"
            className="h-11 w-full rounded-lg border border-zinc-200 px-3 text-zinc-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="slug" className="text-sm font-medium text-zinc-700">
            Slug (opcional)
          </label>
          <input
            id="slug"
            name="slug"
            defaultValue={post?.slug}
            placeholder="mi-articulo"
            className="h-11 w-full rounded-lg border border-zinc-200 px-3 text-zinc-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="excerpt" className="text-sm font-medium text-zinc-700">
          Extracto
        </label>
        <textarea
          id="excerpt"
          name="excerpt"
          rows={2}
          defaultValue={post?.excerpt ?? ""}
          placeholder="Breve descripción del artículo"
          className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-zinc-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="content" className="text-sm font-medium text-zinc-700">
          Contenido * (Markdown)
        </label>
        <textarea
          id="content"
          name="content"
          required
          rows={14}
          defaultValue={post?.content}
          placeholder="# Mi artículo&#10;&#10;Escribe el contenido aquí..."
          className="w-full rounded-lg border border-zinc-200 px-3 py-2 font-mono text-sm text-zinc-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-700">Etiquetas</label>
        <TagSelector
          tags={tags}
          selectedIds={post?.tags?.map((t) => t.id)}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-2">
          <label
            htmlFor="cover_image_url"
            className="text-sm font-medium text-zinc-700"
          >
            URL imagen de portada
          </label>
          <input
            id="cover_image_url"
            name="cover_image_url"
            type="url"
            defaultValue={post?.cover_image_url ?? ""}
            placeholder="https://..."
            className="h-11 w-full rounded-lg border border-zinc-200 px-3 text-zinc-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="status" className="text-sm font-medium text-zinc-700">
            Estado
          </label>
          <select
            id="status"
            name="status"
            defaultValue={post?.status ?? "draft"}
            className="h-11 w-full rounded-lg border border-zinc-200 bg-white px-3 text-zinc-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          Cambios guardados correctamente.
        </div>
      )}

      <div className="flex items-center justify-between border-t border-zinc-200 pt-6">
        {!isNew && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={isPending}
            className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
          >
            Eliminar post
          </button>
        )}
        <div className={`flex gap-3 ${isNew ? "ml-auto" : ""}`}>
          <button
            type="button"
            onClick={() => router.push("/admin/posts")}
            className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-600 transition hover:bg-zinc-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="rounded-lg bg-emerald-700 px-6 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:opacity-50"
          >
            {isPending ? "Guardando..." : isNew ? "Crear post" : "Guardar cambios"}
          </button>
        </div>
      </div>
    </form>
  );
}
