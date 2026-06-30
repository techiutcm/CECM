"use client";

import { uploadBlogMedia } from "@/lib/blog/upload-media";
import Image from "next/image";
import { useRef, useState } from "react";

interface ImageUploadFieldProps {
  name: string;
  label: string;
  defaultValue?: string | null;
  helperText?: string;
  aspectClassName?: string;
}

export function ImageUploadField({
  name,
  label,
  defaultValue = "",
  helperText,
  aspectClassName = "aspect-[16/10]",
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState(defaultValue ?? "");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(file: File | null) {
    if (!file) return;

    setError(null);
    setIsUploading(true);

    try {
      const publicUrl = await uploadBlogMedia(file, "image");
      setUrl(publicUrl);
    } catch (uploadError) {
      setError(
        uploadError instanceof Error ? uploadError.message : "Error al subir imagen",
      );
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-zinc-700">{label}</label>

      <input type="hidden" name={name} value={url} />

      <div
        className={`relative overflow-hidden rounded-xl border border-dashed border-zinc-300 bg-zinc-50 ${aspectClassName}`}
      >
        {url ? (
          <Image
            src={url}
            alt="Vista previa"
            fill
            className="object-cover"
            sizes="320px"
          />
        ) : (
          <div className="flex h-full min-h-[140px] flex-col items-center justify-center px-4 text-center text-sm text-zinc-500">
            <p>Arrastra una imagen o usa el botón de abajo</p>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:opacity-50"
        >
          {isUploading ? "Subiendo..." : "Subir imagen"}
        </button>
        {url && (
          <button
            type="button"
            onClick={() => setUrl("")}
            className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
          >
            Quitar
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0] ?? null;
          void handleFileChange(file);
          event.target.value = "";
        }}
      />

      <input
        type="url"
        value={url}
        onChange={(event) => setUrl(event.target.value)}
        placeholder="https://... o sube un archivo"
        className="h-10 w-full rounded-lg border border-zinc-200 px-3 text-sm text-zinc-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
      />

      {helperText && <p className="text-xs text-zinc-500">{helperText}</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
