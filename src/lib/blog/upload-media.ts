export async function uploadBlogMedia(file: File, mediaType: "image" | "video" = "image") {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("media_type", mediaType);

  const response = await fetch("/api/media/upload", {
    method: "POST",
    body: formData,
  });

  const payload = (await response.json()) as {
    data?: { public_url: string };
    error?: string;
  };

  if (!response.ok || !payload.data?.public_url) {
    throw new Error(payload.error ?? "No se pudo subir el archivo");
  }

  return payload.data.public_url;
}
