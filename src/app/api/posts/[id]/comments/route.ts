import { requireAuth } from "@/lib/api/auth";
import { jsonCreated, jsonError, jsonOk } from "@/lib/api/response";
import { createCommentSchema, paginationSchema } from "@/lib/api/validations";
import { createClient } from "@/lib/supabase/server";

interface RouteContext {
  params: Promise<{ id: string }>;
}

const COMMENT_SELECT = `
  *,
  author:profiles!comments_user_id_fkey(id, username, full_name, avatar_url)
`;

export async function GET(request: Request, context: RouteContext) {
  const { id: postId } = await context.params;
  const { searchParams } = new URL(request.url);
  const pagination = paginationSchema.safeParse({
    page: searchParams.get("page") ?? 1,
    limit: searchParams.get("limit") ?? 20,
  });

  if (!pagination.success) {
    return jsonError(pagination.error.issues[0]?.message ?? "Paginación inválida");
  }

  const { page, limit } = pagination.data;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const supabase = await createClient();
  const { data, error, count } = await supabase
    .from("comments")
    .select(COMMENT_SELECT, { count: "exact" })
    .eq("post_id", postId)
    .is("parent_id", null)
    .order("created_at", { ascending: true })
    .range(from, to);

  if (error) return jsonError(error.message, 500);

  const comments = data ?? [];
  const parentIds = comments.map((c) => c.id);

  let replies: typeof comments = [];
  if (parentIds.length > 0) {
    const { data: replyData } = await supabase
      .from("comments")
      .select(COMMENT_SELECT)
      .in("parent_id", parentIds)
      .order("created_at", { ascending: true });
    replies = replyData ?? [];
  }

  const repliesByParent = replies.reduce<Record<string, typeof replies>>(
    (acc, reply) => {
      const key = reply.parent_id as string;
      acc[key] = acc[key] ?? [];
      acc[key].push(reply);
      return acc;
    },
    {},
  );

  return jsonOk({
    items: comments.map((comment) => ({
      ...comment,
      replies: repliesByParent[comment.id] ?? [],
    })),
    pagination: {
      page,
      limit,
      total: count ?? 0,
      total_pages: Math.ceil((count ?? 0) / limit),
    },
  });
}

export async function POST(request: Request, context: RouteContext) {
  const auth = await requireAuth();
  if (!auth.user) return jsonError(auth.error!, auth.status);

  const { id: postId } = await context.params;
  const body = await request.json();
  const parsed = createCommentSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Datos inválidos");
  }

  const supabase = await createClient();
  const { data: post } = await supabase
    .from("posts")
    .select("id, status")
    .eq("id", postId)
    .maybeSingle();

  if (!post) return jsonError("Post no encontrado", 404);
  if (post.status !== "published") {
    return jsonError("Solo se pueden comentar posts publicados", 400);
  }

  const { data, error } = await supabase
    .from("comments")
    .insert({
      post_id: postId,
      user_id: auth.user.id,
      content: parsed.data.content,
      parent_id: parsed.data.parent_id ?? null,
      status: "pending",
    })
    .select(COMMENT_SELECT)
    .single();

  if (error) return jsonError(error.message, 500);
  return jsonCreated(data);
}
