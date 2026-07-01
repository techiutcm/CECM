import { requireAuth } from "@/lib/api/auth";
import { jsonError, jsonOk } from "@/lib/api/response";
import { updateCommentSchema } from "@/lib/api/validations";
import { createClient } from "@/lib/supabase/server";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, context: RouteContext) {
  const auth = await requireAuth();
  if (!auth.user) return jsonError(auth.error!, auth.status);

  const { id } = await context.params;
  const body = await request.json();
  const parsed = updateCommentSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Datos inválidos");
  }

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("comments")
    .select("id, user_id, post_id")
    .eq("id", id)
    .maybeSingle();

  if (!existing) return jsonError("Comentario no encontrado", 404);

  const { data: post } = await supabase
    .from("posts")
    .select("author_id")
    .eq("id", existing.post_id)
    .maybeSingle();

  const postAuthorId = post?.author_id;
  const isOwner = existing.user_id !== null && existing.user_id === auth.user.id;
  const isModerator =
    auth.user.roles.includes("editor") ||
    auth.user.roles.includes("admin") ||
    postAuthorId === auth.user.id;

  const { content, status } = parsed.data;

  if (content && !isOwner) {
    return jsonError("Solo puedes editar tu propio comentario", 403);
  }

  if (status && !isModerator) {
    return jsonError("Sin permisos para moderar comentarios", 403);
  }

  const { data, error } = await supabase
    .from("comments")
    .update(parsed.data)
    .eq("id", id)
    .select("*")
    .single();

  if (error) return jsonError(error.message, 500);
  return jsonOk(data);
}

export async function DELETE(_request: Request, context: RouteContext) {
  const auth = await requireAuth();
  if (!auth.user) return jsonError(auth.error!, auth.status);

  const { id } = await context.params;
  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("comments")
    .select("user_id")
    .eq("id", id)
    .maybeSingle();

  if (!existing) return jsonError("Comentario no encontrado", 404);

  const isOwner = existing.user_id !== null && existing.user_id === auth.user.id;
  const isModerator =
    auth.user.roles.includes("editor") || auth.user.roles.includes("admin");

  if (!isOwner && !isModerator) {
    return jsonError("Sin permisos para eliminar este comentario", 403);
  }

  const { error } = await supabase.from("comments").delete().eq("id", id);
  if (error) return jsonError(error.message, 500);

  return jsonOk({ deleted: true });
}
