"use server";

import { requireAdminAccess } from "@/lib/admin/guard";
import { slugify } from "@/lib/api/slug";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createTagAction(formData: FormData) {
  await requireAdminAccess("editor");

  const name = String(formData.get("name") ?? "").trim();
  if (name.length < 2) {
    return { error: "El nombre debe tener al menos 2 caracteres" };
  }

  const slug = slugify(String(formData.get("slug") || name));
  const supabase = await createClient();

  const { error } = await supabase.from("tags").insert({ name, slug });
  if (error) return { error: error.message };

  revalidatePath("/admin/tags");
  revalidatePath("/blog");
  return { success: true };
}
