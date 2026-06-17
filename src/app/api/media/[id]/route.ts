import { requireAuth } from "@/lib/api/auth";
import { jsonError, jsonOk } from "@/lib/api/response";
import { createClient } from "@/lib/supabase/server";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function DELETE(_request: Request, context: RouteContext) {
  const auth = await requireAuth("author");
  if (!auth.user) return jsonError(auth.error!, auth.status);

  const { id } = await context.params;
  const supabase = await createClient();

  const { data: media } = await supabase
    .from("post_media")
    .select("id, storage_path, post_id")
    .eq("id", id)
    .maybeSingle();

  if (!media) return jsonError("Media no encontrada", 404);

  const { data: post } = await supabase
    .from("posts")
    .select("author_id")
    .eq("id", media.post_id)
    .maybeSingle();

  const postAuthorId = post?.author_id;
  const isOwner = postAuthorId === auth.user.id;
  const isEditor =
    auth.user.roles.includes("editor") || auth.user.roles.includes("admin");

  if (!isOwner && !isEditor) {
    return jsonError("Sin permisos para eliminar esta media", 403);
  }

  const bucket = media.storage_path.startsWith("blog-videos")
    ? "blog-videos"
    : "blog-images";
  const path = media.storage_path.replace(`${bucket}/`, "");

  await supabase.storage.from(bucket).remove([path]);

  const { error } = await supabase.from("post_media").delete().eq("id", id);
  if (error) return jsonError(error.message, 500);

  return jsonOk({ deleted: true });
}
