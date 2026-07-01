import { requireAuth } from "@/lib/api/auth";
import { jsonCreated, jsonError, jsonOk } from "@/lib/api/response";
import { createPostSchema, paginationSchema } from "@/lib/api/validations";
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
import type { PostStatus } from "@/types/blog";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pagination = paginationSchema.safeParse({
    page: searchParams.get("page") ?? 1,
    limit: searchParams.get("limit") ?? 10,
  });

  if (!pagination.success) {
    return jsonError(pagination.error.issues[0]?.message ?? "Paginación inválida");
  }

  const status = (searchParams.get("status") ?? "published") as PostStatus;
  const authorId = searchParams.get("author_id");
  const { page, limit } = pagination.data;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const supabase = await createClient();
  let query = supabase
    .from("posts")
    .select(POST_SELECT, { count: "exact" })
    .order("published_at", { ascending: false, nullsFirst: false })
    .range(from, to);

  if (status) query = query.eq("status", status);
  if (authorId) query = query.eq("author_id", authorId);

  const { data, error, count } = await query;
  if (error) return jsonError(error.message, 500);

  return jsonOk({
    items: (data ?? []).map((row) => {
      const post = mapPost(row as Record<string, unknown>) as Record<string, unknown>;
      return {
        ...post,
        author: sanitizePublicAuthor(
          post.author as { full_name: string | null; username: string | null } | undefined,
        ),
      };
    }),
    pagination: {
      page,
      limit,
      total: count ?? 0,
      total_pages: Math.ceil((count ?? 0) / limit),
    },
  });
}

export async function POST(request: Request) {
  const auth = await requireAuth("author");
  if (!auth.user) return jsonError(auth.error!, auth.status);

  const body = await request.json();
  const parsed = createPostSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Datos inválidos");
  }

  const { tag_ids, slug: inputSlug, status, ...postData } = parsed.data;
  const slug = await ensureUniqueSlug(resolveSlug(postData.title, inputSlug));

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .insert({
      ...postData,
      slug,
      status,
      author_id: auth.user.id,
      published_at: buildPublishedAt(status, null),
    })
    .select(POST_SELECT)
    .single();

  if (error) return jsonError(error.message, 500);

  if (tag_ids?.length) {
    await syncPostTags(data.id, tag_ids);
  }

  return jsonCreated(mapPost(data as Record<string, unknown>));
}
