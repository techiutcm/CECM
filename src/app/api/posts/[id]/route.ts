import { requireAuth } from "@/lib/api/auth";
import { jsonError, jsonOk } from "@/lib/api/response";
import { updatePostSchema } from "@/lib/api/validations";
import {
  POST_SELECT,
  buildPublishedAt,
  ensureUniqueSlug,
  mapPost,
  resolveSlug,
  syncPostTags,
} from "@/lib/blog/posts";
import { sanitizePublicAuthor } from "@/lib/blog/author-display";
import { createClient } from "@/lib/supabase/server";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("posts")
    .select(POST_SELECT)
    .eq("id", id)
    .maybeSingle();

  if (error) return jsonError(error.message, 500);
  if (!data) return jsonError("Post no encontrado", 404);

  const post = mapPost(data as Record<string, unknown>) as Record<string, unknown>;

  return jsonOk({
    ...post,
    author: sanitizePublicAuthor(
      post.author as { full_name: string | null; username: string | null } | undefined,
    ),
  });
}

export async function PATCH(request: Request, context: RouteContext) {
  const auth = await requireAuth("author");
  if (!auth.user) return jsonError(auth.error!, auth.status);

  const { id } = await context.params;
  const body = await request.json();
  const parsed = updatePostSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Datos inválidos");
  }

  const supabase = await createClient();
  const { data: existing, error: fetchError } = await supabase
    .from("posts")
    .select("id, author_id, published_at, slug")
    .eq("id", id)
    .maybeSingle();

  if (fetchError) return jsonError(fetchError.message, 500);
  if (!existing) return jsonError("Post no encontrado", 404);

  const isOwner = existing.author_id === auth.user.id;
  const isEditor = auth.user.roles.includes("editor") || auth.user.roles.includes("admin");
  if (!isOwner && !isEditor) {
    return jsonError("Sin permisos para editar este post", 403);
  }

  const { tag_ids, slug: inputSlug, title, status, ...rest } = parsed.data;
  const updates: Record<string, unknown> = { ...rest };

  if (title) updates.title = title;
  if (status) {
    updates.status = status;
    updates.published_at = buildPublishedAt(status, existing.published_at);
  }
  if (inputSlug || title) {
    const base = resolveSlug(title ?? existing.slug, inputSlug);
    updates.slug = await ensureUniqueSlug(base, id);
  }

  const { data, error } = await supabase
    .from("posts")
    .update(updates)
    .eq("id", id)
    .select(POST_SELECT)
    .single();

  if (error) return jsonError(error.message, 500);

  if (tag_ids) {
    await syncPostTags(id, tag_ids);
  }

  return jsonOk(mapPost(data as Record<string, unknown>));
}

export async function DELETE(_request: Request, context: RouteContext) {
  const auth = await requireAuth("author");
  if (!auth.user) return jsonError(auth.error!, auth.status);

  const { id } = await context.params;
  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("posts")
    .select("author_id")
    .eq("id", id)
    .maybeSingle();

  if (!existing) return jsonError("Post no encontrado", 404);

  const isOwner = existing.author_id === auth.user.id;
  const isAdmin = auth.user.roles.includes("admin");
  if (!isOwner && !isAdmin) {
    return jsonError("Sin permisos para eliminar este post", 403);
  }

  const { error } = await supabase.from("posts").delete().eq("id", id);
  if (error) return jsonError(error.message, 500);

  return jsonOk({ deleted: true });
}
