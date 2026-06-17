import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/api/slug";
import type { PostStatus } from "@/types/blog";

const POST_SELECT = `
  *,
  author:profiles!posts_author_id_fkey(id, username, full_name, avatar_url),
  post_tags(tag_id, tags(id, name, slug))
`;

export async function ensureUniqueSlug(baseSlug: string, excludeId?: string) {
  const supabase = await createClient();
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    let query = supabase.from("posts").select("id").eq("slug", slug);
    if (excludeId) query = query.neq("id", excludeId);
    const { data } = await query.maybeSingle();
    if (!data) return slug;
    counter += 1;
    slug = `${baseSlug}-${counter}`;
  }
}

export function mapPost(row: Record<string, unknown>) {
  const postTags = row.post_tags as
    | { tags: { id: string; name: string; slug: string } }[]
    | undefined;

  const { post_tags: _, ...post } = row;
  return {
    ...post,
    tags: postTags?.map((pt) => pt.tags).filter(Boolean) ?? [],
  };
}

export async function syncPostTags(postId: string, tagIds: string[]) {
  const supabase = await createClient();
  await supabase.from("post_tags").delete().eq("post_id", postId);

  if (tagIds.length === 0) return;

  await supabase.from("post_tags").insert(
    tagIds.map((tag_id) => ({ post_id: postId, tag_id })),
  );
}

export function buildPublishedAt(
  status: PostStatus,
  currentPublishedAt: string | null,
): string | null {
  if (status === "published") {
    return currentPublishedAt ?? new Date().toISOString();
  }
  return null;
}

export function resolveSlug(title: string, slug?: string) {
  return slugify(slug?.trim() || title);
}

export { POST_SELECT };
