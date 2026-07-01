"use server";

import { requireAdminAccess } from "@/lib/admin/guard";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function moderateCommentAction(
  id: string,
  status: "approved" | "rejected",
) {
  await requireAdminAccess("editor");

  const supabase = await createClient();
  const { data: comment, error: fetchError } = await supabase
    .from("comments")
    .select("id, post_id")
    .eq("id", id)
    .maybeSingle();

  if (fetchError) return { error: fetchError.message };
  if (!comment) return { error: "Comentario no encontrado" };

  const { error } = await supabase
    .from("comments")
    .update({ status })
    .eq("id", id);

  if (error) return { error: error.message };

  const { data: post } = await supabase
    .from("posts")
    .select("slug")
    .eq("id", comment.post_id)
    .maybeSingle();

  if (post?.slug) {
    revalidatePath(`/blog/${post.slug}`);
  }

  revalidatePath("/admin/comments");
  revalidatePath("/admin");
  return { success: true };
}
