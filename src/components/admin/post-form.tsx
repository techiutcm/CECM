"use client";

import {
  createPostAction,
  deletePostAction,
  updatePostAction,
} from "@/app/admin/actions/posts";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
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
      <div className="grid gap-8 xl:grid-cols-[minmax(280px,320px)_minmax(0,1fr)]">
        <aside className="space-y-6">
          <section className="rounded-xl border border-zinc-200 bg-zinc-50/80 p-5">
            <h2 className="text-sm font-semibold text-zinc-900">Detalles del post</h2>
            <p className="mt-1 text-xs text-zinc-500">
              Configura título, portada y publicación desde este panel lateral.
            </p>

            <div className="mt-5 space-y-5">
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
                  className="h-11 w-full rounded-lg border border-zinc-200 bg-white px-3 text-zinc-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
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
                  className="h-11 w-full rounded-lg border border-zinc-200 bg-white px-3 text-zinc-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="excerpt" className="text-sm font-medium text-zinc-700">
                  Extracto
                </label>
                <textarea
                  id="excerpt"
                  name="excerpt"
                  rows={3}
                  defaultValue={post?.excerpt ?? ""}
                  placeholder="Breve descripción del artículo"
                  className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-zinc-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
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

              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700">Etiquetas</label>
                <TagSelector
                  tags={tags}
                  selectedIds={post?.tags?.map((t) => t.id)}
                />
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
            <ImageUploadField
              name="cover_image_url"
              label="Imagen de portada"
              defaultValue={post?.cover_image_url}
              helperText="Sube una imagen o pega una URL pública para la portada del artículo."
            />
          </section>
        </aside>

        <main className="space-y-3">
          <div>
            <h2 className="text-sm font-semibold text-zinc-900">Contenido del artículo</h2>
            <p className="mt-1 text-xs text-zinc-500">
              Editor visual con formato, enlaces e imágenes insertables en el texto.
            </p>
          </div>

          <RichTextEditor
            name="content"
            initialContent={post?.content ?? ""}
            placeholder="Escribe aquí el contenido del artículo..."
          />
        </main>
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
