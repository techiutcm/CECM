import { hasRole } from "@/lib/api/auth";
import { POST_SELECT, mapPost } from "@/lib/blog/posts";
import { createClient } from "@/lib/supabase/server";
import type { AuthUser, Comment, Post, Tag } from "@/types/blog";

export async function getAllTags(): Promise<Tag[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tags")
    .select("*")
    .order("name", { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []) as Tag[];
}

export async function getAdminPosts(user: AuthUser): Promise<Post[]> {
  const supabase = await createClient();
  let query = supabase
    .from("posts")
    .select(POST_SELECT)
    .order("updated_at", { ascending: false });

  if (!hasRole(user.roles, "editor")) {
    query = query.eq("author_id", user.id);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);

  return (data ?? []).map((row) =>
    mapPost(row as Record<string, unknown>),
  ) as Post[];
}

export async function getAdminPostById(
  user: AuthUser,
  id: string,
): Promise<Post | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select(POST_SELECT)
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) return null;

  const post = mapPost(data as Record<string, unknown>) as Post;
  const isOwner = post.author_id === user.id;
  const isEditor = hasRole(user.roles, "editor");

  if (!isOwner && !isEditor) return null;
  return post;
}

export async function getPendingCommentsCount(): Promise<number> {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("comments")
    .select("id", { count: "exact", head: true })
    .eq("status", "pending");

  if (error) throw new Error(error.message);
  return count ?? 0;
}

export async function getAdminStats(user: AuthUser) {
  const supabase = await createClient();

  let postsQuery = supabase.from("posts").select("status");
  if (!hasRole(user.roles, "editor")) {
    postsQuery = postsQuery.eq("author_id", user.id);
  }

  const [postsResult, pendingComments] = await Promise.all([
    postsQuery,
    hasRole(user.roles, "editor")
      ? getPendingCommentsCount()
      : Promise.resolve(0),
  ]);

  const posts = postsResult.data ?? [];
  const stats = {
    total: posts.length,
    published: posts.filter((p) => p.status === "published").length,
    draft: posts.filter((p) => p.status === "draft").length,
    archived: posts.filter((p) => p.status === "archived").length,
    pendingComments,
  };

  return stats;
}

export async function getPendingComments(): Promise<Comment[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("comments")
    .select(
      `
      *,
      author:profiles!comments_user_id_fkey(id, username, full_name, avatar_url),
      post:posts!comments_post_id_fkey(id, title, slug)
    `,
    )
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as Comment[];
}
