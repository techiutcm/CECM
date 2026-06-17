"use server";

import { requireAdminAccess } from "@/lib/admin/guard";
import { hasRole } from "@/lib/api/auth";
import {
  buildPublishedAt,
  ensureUniqueSlug,
  resolveSlug,
  syncPostTags,
} from "@/lib/blog/posts";
import { createPostSchema, updatePostSchema } from "@/lib/api/validations";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function parseTagIds(formData: FormData): string[] {
  return formData.getAll("tag_ids").map(String).filter(Boolean);
}

export async function createPostAction(formData: FormData) {
  const user = await requireAdminAccess("author");

  const parsed = createPostSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug") || undefined,
    excerpt: formData.get("excerpt") || undefined,
    content: formData.get("content"),
    cover_image_url: formData.get("cover_image_url") || null,
    status: formData.get("status") ?? "draft",
    tag_ids: parseTagIds(formData),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const { slug: inputSlug, status, tag_ids, ...postData } = parsed.data;
  const slug = await ensureUniqueSlug(resolveSlug(postData.title, inputSlug));

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .insert({
      ...postData,
      slug,
      status,
      author_id: user.id,
      published_at: buildPublishedAt(status, null),
    })
    .select("id")
    .single();

  if (error) return { error: error.message };

  if (tag_ids?.length) {
    await syncPostTags(data.id, tag_ids);
  }

  revalidatePath("/blog");
  revalidatePath("/admin");
  revalidatePath("/admin/posts");
  redirect(`/admin/posts/${data.id}/edit?created=1`);
}

export async function updatePostAction(id: string, formData: FormData) {
  const user = await requireAdminAccess("author");

  const parsed = updatePostSchema.safeParse({
    title: formData.get("title") || undefined,
    slug: formData.get("slug") || undefined,
    excerpt: formData.get("excerpt") || undefined,
    content: formData.get("content") || undefined,
    cover_image_url: formData.get("cover_image_url") || null,
    status: formData.get("status") || undefined,
    tag_ids: parseTagIds(formData),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("posts")
    .select("id, author_id, published_at, slug")
    .eq("id", id)
    .maybeSingle();

  if (!existing) return { error: "Post no encontrado" };

  const isOwner = existing.author_id === user.id;
  const isEditor = hasRole(user.roles, "editor");
  if (!isOwner && !isEditor) return { error: "Sin permisos" };

  const { slug: inputSlug, title, status, tag_ids, ...rest } = parsed.data;
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

  const { error } = await supabase.from("posts").update(updates).eq("id", id);
  if (error) return { error: error.message };

  if (tag_ids !== undefined) {
    await syncPostTags(id, tag_ids);
  }

  revalidatePath("/blog");
  revalidatePath("/admin");
  revalidatePath("/admin/posts");
  revalidatePath(`/admin/posts/${id}/edit`);
  return { success: true };
}

export async function deletePostAction(id: string) {
  const user = await requireAdminAccess("author");

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("posts")
    .select("author_id")
    .eq("id", id)
    .maybeSingle();

  if (!existing) return { error: "Post no encontrado" };

  const isOwner = existing.author_id === user.id;
  const isAdmin = hasRole(user.roles, "admin");
  if (!isOwner && !isAdmin) return { error: "Sin permisos" };

  const { error } = await supabase.from("posts").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin");
  revalidatePath("/admin/posts");
  redirect("/admin/posts");
}
