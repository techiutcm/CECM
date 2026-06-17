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
  const { error } = await supabase
    .from("comments")
    .update({ status })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/comments");
  revalidatePath("/admin");
  return { success: true };
}
