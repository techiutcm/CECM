import { POST_SELECT, mapPost } from "@/lib/blog/posts";
import { sanitizePublicAuthor } from "@/lib/blog/author-display";
import { createClient } from "@/lib/supabase/server";
import type { Comment, Post, Tag } from "@/types/blog";

const COMMENT_SELECT = `
  *,
  author:profiles!comments_user_id_fkey(id, username, full_name, avatar_url)
`;

export const POSTS_PER_PAGE = 6;

function sanitizePublicPost(post: Post): Post {
  return {
    ...post,
    author: sanitizePublicAuthor(post.author),
  };
}

function sanitizePublicComment(comment: Comment): Comment {
  const { guest_email: _, ...rest } = comment;

  return {
    ...rest,
    guest_email: null,
    author: sanitizePublicAuthor(comment.author),
    replies: comment.replies?.map(sanitizePublicComment),
  };
}

const POST_SELECT_WITH_TAG_FILTER = `
  *,
  author:profiles!posts_author_id_fkey(id, username, full_name, avatar_url),
  post_tags!inner(tag_id, tags!inner(id, name, slug))
`;

interface GetPublishedPostsOptions {
  page?: number;
  limit?: number;
  tagSlug?: string;
}

export interface PaginatedPosts {
  items: Post[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export async function getPublishedPosts(
  options: GetPublishedPostsOptions = {},
): Promise<PaginatedPosts> {
  const limit = options.limit ?? POSTS_PER_PAGE;
  const page = Math.max(1, options.page ?? 1);
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const supabase = await createClient();
  const select = options.tagSlug ? POST_SELECT_WITH_TAG_FILTER : POST_SELECT;

  let query = supabase
    .from("posts")
    .select(select, { count: "exact" })
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .range(from, to);

  if (options.tagSlug) {
    query = query.eq("post_tags.tags.slug", options.tagSlug);
  }

  const { data, error, count } = await query;
  if (error) throw new Error(error.message);

  const total = count ?? 0;

  return {
    items: (data ?? []).map((row) =>
      sanitizePublicPost(mapPost(row as Record<string, unknown>) as Post),
    ),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    },
  };
}

export async function getPublishedTags(): Promise<Tag[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tags")
    .select("id, name, slug, created_at, post_tags!inner(posts!inner(status))")
    .eq("post_tags.posts.status", "published")
    .order("name", { ascending: true });

  if (error) throw new Error(error.message);

  const unique = new Map<string, Tag>();
  for (const row of data ?? []) {
    const { post_tags: _, ...tag } = row as Tag & { post_tags: unknown };
    unique.set(tag.id, tag);
  }

  return Array.from(unique.values());
}

export async function getPublishedPostBySlug(slug: string): Promise<Post | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select(POST_SELECT)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) return null;

  return sanitizePublicPost(mapPost(data as Record<string, unknown>) as Post);
}

export async function getApprovedComments(postId: string): Promise<Comment[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("comments")
    .select(COMMENT_SELECT)
    .eq("post_id", postId)
    .eq("status", "approved")
    .is("parent_id", null)
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);

  const comments = (data ?? []) as Comment[];
  const parentIds = comments.map((c) => c.id);

  if (parentIds.length === 0) return comments;

  const { data: replies } = await supabase
    .from("comments")
    .select(COMMENT_SELECT)
    .in("parent_id", parentIds)
    .eq("status", "approved")
    .order("created_at", { ascending: true });

  const repliesByParent = (replies ?? []).reduce<Record<string, Comment[]>>(
    (acc, reply) => {
      const key = reply.parent_id as string;
      acc[key] = acc[key] ?? [];
      acc[key].push(reply as Comment);
      return acc;
    },
    {},
  );

  return comments.map((comment) =>
    sanitizePublicComment({
      ...comment,
      replies: repliesByParent[comment.id] ?? [],
    }),
  );
}

export function buildBlogListUrl(page?: number, tag?: string) {
  const params = new URLSearchParams();
  if (tag) params.set("tag", tag);
  if (page && page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `/blog?${query}` : "/blog";
}
