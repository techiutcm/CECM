import { requireAuth } from "@/lib/api/auth";
import { jsonCreated, jsonError, jsonOk } from "@/lib/api/response";
import { createMediaSchema } from "@/lib/api/validations";
import { createClient } from "@/lib/supabase/server";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  const { id: postId } = await context.params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("post_media")
    .select("*")
    .eq("post_id", postId)
    .order("sort_order", { ascending: true });

  if (error) return jsonError(error.message, 500);
  return jsonOk(data ?? []);
}

export async function POST(request: Request, context: RouteContext) {
  const auth = await requireAuth("author");
  if (!auth.user) return jsonError(auth.error!, auth.status);

  const { id: postId } = await context.params;
  const body = await request.json();
  const parsed = createMediaSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Datos inválidos");
  }

  const supabase = await createClient();
  const { data: post } = await supabase
    .from("posts")
    .select("id, author_id")
    .eq("id", postId)
    .maybeSingle();

  if (!post) return jsonError("Post no encontrado", 404);

  const isOwner = post.author_id === auth.user.id;
  const isEditor =
    auth.user.roles.includes("editor") || auth.user.roles.includes("admin");
  if (!isOwner && !isEditor) {
    return jsonError("Sin permisos para agregar media a este post", 403);
  }

  const { data, error } = await supabase
    .from("post_media")
    .insert({ ...parsed.data, post_id: postId })
    .select("*")
    .single();

  if (error) return jsonError(error.message, 500);
  return jsonCreated(data);
}
