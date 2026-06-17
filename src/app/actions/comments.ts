"use server";

import { getAuthUser } from "@/lib/api/auth";
import { createCommentSchema } from "@/lib/api/validations";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function submitCommentAction(postId: string, formData: FormData) {
  const user = await getAuthUser();
  if (!user) {
    return { error: "Debes iniciar sesión para comentar" };
  }

  const parsed = createCommentSchema.safeParse({
    content: formData.get("content"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Comentario inválido" };
  }

  const supabase = await createClient();
  const { data: post } = await supabase
    .from("posts")
    .select("slug, status")
    .eq("id", postId)
    .maybeSingle();

  if (!post || post.status !== "published") {
    return { error: "No se puede comentar en este post" };
  }

  const { error } = await supabase.from("comments").insert({
    post_id: postId,
    user_id: user.id,
    content: parsed.data.content,
    status: "pending",
  });

  if (error) return { error: error.message };

  revalidatePath(`/blog/${post.slug}`);
  return { success: true };
}
