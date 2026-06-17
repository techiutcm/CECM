import { requireAuth } from "@/lib/api/auth";
import { jsonError, jsonOk } from "@/lib/api/response";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const auth = await requireAuth("author");
  if (!auth.user) return jsonError(auth.error!, auth.status);

  const formData = await request.formData();
  const file = formData.get("file");
  const mediaType = formData.get("media_type");

  if (!(file instanceof File)) {
    return jsonError("Se requiere un archivo en el campo 'file'");
  }

  if (mediaType !== "image" && mediaType !== "video") {
    return jsonError("media_type debe ser 'image' o 'video'");
  }

  const bucket = mediaType === "video" ? "blog-videos" : "blog-images";
  const extension = file.name.split(".").pop() ?? "bin";
  const path = `${auth.user.id}/${Date.now()}-${crypto.randomUUID()}.${extension}`;

  const supabase = await createClient();
  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(path, file, { upsert: false, contentType: file.type });

  if (uploadError) return jsonError(uploadError.message, 500);

  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(path);

  return jsonOk({
    media_type: mediaType,
    storage_path: `${bucket}/${path}`,
    public_url: publicUrl,
  });
}
