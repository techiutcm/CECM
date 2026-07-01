import { jsonCreated, jsonError, jsonOk } from "@/lib/api/response";
import { guestCommentSchema, paginationSchema } from "@/lib/api/validations";
import { getBlogModeratorEmails } from "@/lib/blog/moderator-emails";
import { sanitizePublicAuthor } from "@/lib/blog/author-display";
import { sendCommentPendingModerationEmail } from "@/lib/email/resend";
import { createServiceClient } from "@/lib/supabase/service";

interface RouteContext {
  params: Promise<{ id: string }>;
}

const COMMENT_SELECT = `
  *,
  author:profiles!comments_user_id_fkey(id, username, full_name, avatar_url)
`;

function sanitizePublicComment<T extends Record<string, unknown>>(comment: T) {
  const { guest_email: _, author, ...rest } = comment;

  return {
    ...rest,
    guest_email: null,
    author: sanitizePublicAuthor(
      author as { full_name: string | null; username: string | null } | null | undefined,
    ),
  };
}

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

  const supabase = createServiceClient();
  const { data, error, count } = await supabase
    .from("comments")
    .select(COMMENT_SELECT, { count: "exact" })
    .eq("post_id", postId)
    .eq("status", "approved")
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
      .eq("status", "approved")
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
    items: comments.map((comment) =>
      sanitizePublicComment({
        ...comment,
        replies: (repliesByParent[comment.id] ?? []).map(sanitizePublicComment),
      }),
    ),
    pagination: {
      page,
      limit,
      total: count ?? 0,
      total_pages: Math.ceil((count ?? 0) / limit),
    },
  });
}

export async function POST(request: Request, context: RouteContext) {
  const { id: postId } = await context.params;
  const body = await request.json();
  const parsed = guestCommentSchema.safeParse(body);

  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Datos inválidos");
  }

  const supabase = createServiceClient();
  const { data: post } = await supabase
    .from("posts")
    .select("id, slug, title, status, author_id")
    .eq("id", postId)
    .maybeSingle();

  if (!post) return jsonError("Post no encontrado", 404);
  if (post.status !== "published") {
    return jsonError("Solo se pueden comentar posts publicados", 400);
  }

  const guestEmail = parsed.data.guest_email?.trim() || null;

  const { data, error } = await supabase
    .from("comments")
    .insert({
      post_id: postId,
      user_id: null,
      guest_name: parsed.data.guest_name,
      guest_email: guestEmail,
      content: parsed.data.content,
      parent_id: parsed.data.parent_id ?? null,
      status: "pending",
    })
    .select(COMMENT_SELECT)
    .single();

  if (error) return jsonError(error.message, 500);

  try {
    const moderatorEmails = await getBlogModeratorEmails(post.author_id);
    await sendCommentPendingModerationEmail({
      to: moderatorEmails,
      guestName: parsed.data.guest_name,
      guestEmail,
      postTitle: post.title,
      postSlug: post.slug,
      commentPreview: parsed.data.content,
    });
  } catch {
    // El comentario ya quedó guardado.
  }

  return jsonCreated(data);
}
