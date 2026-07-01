"use server";

import { getBlogModeratorEmails } from "@/lib/blog/moderator-emails";
import { guestCommentSchema } from "@/lib/api/validations";
import { sendCommentPendingModerationEmail } from "@/lib/email/resend";
import { createServiceClient } from "@/lib/supabase/service";
import { revalidatePath } from "next/cache";

export async function submitCommentAction(postId: string, formData: FormData) {
  const parsed = guestCommentSchema.safeParse({
    guest_name: formData.get("guest_name"),
    guest_email: formData.get("guest_email"),
    content: formData.get("content"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Comentario inválido" };
  }

  const supabase = createServiceClient();
  const { data: post } = await supabase
    .from("posts")
    .select("id, slug, title, status, author_id")
    .eq("id", postId)
    .maybeSingle();

  if (!post || post.status !== "published") {
    return { error: "No se puede comentar en este artículo" };
  }

  const guestEmail = parsed.data.guest_email?.trim() || null;

  const { error } = await supabase.from("comments").insert({
    post_id: postId,
    user_id: null,
    guest_name: parsed.data.guest_name,
    guest_email: guestEmail,
    content: parsed.data.content,
    status: "pending",
  });

  if (error) return { error: error.message };

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
    // El comentario ya quedó guardado; el correo es informativo.
  }

  revalidatePath("/admin/comments");
  revalidatePath("/admin");
  revalidatePath(`/blog/${post.slug}`);
  return { success: true };
}
