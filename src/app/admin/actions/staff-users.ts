"use server";

import { requireAdminAccess } from "@/lib/admin/guard";
import { createStaffUserSchema } from "@/lib/api/validations";
import { createStaffUser, setStaffUserActive } from "@/lib/admin/staff-users";
import type { StaffPanel } from "@/types/staff";
import { revalidatePath } from "next/cache";

function revalidateStaffPaths(panel: StaffPanel) {
  if (panel === "blog") {
    revalidatePath("/admin/usuarios");
    return;
  }

  revalidatePath("/admin/admisiones/configuracion");
}

export async function createStaffUserAction(formData: FormData) {
  await requireAdminAccess("admin");

  const parsed = createStaffUserSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    full_name: formData.get("full_name"),
    title: formData.get("title"),
    panel: formData.get("panel"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const result = await createStaffUser({
    email: parsed.data.email,
    password: parsed.data.password,
    fullName: parsed.data.full_name,
    title: parsed.data.title,
    panel: parsed.data.panel,
  });

  if ("error" in result && result.error) {
    return { error: result.error };
  }

  revalidateStaffPaths(parsed.data.panel);

  return {
    success: true as const,
    message: `Usuario ${parsed.data.email} creado correctamente`,
  };
}

export async function toggleStaffUserActiveAction(formData: FormData) {
  await requireAdminAccess("admin");

  const profileId = String(formData.get("profile_id") ?? "");
  const panel = String(formData.get("panel") ?? "") as StaffPanel;
  const isActive = String(formData.get("is_active") ?? "") === "true";

  if (!profileId || (panel !== "blog" && panel !== "admisiones")) {
    return { error: "Datos inválidos" };
  }

  const result = await setStaffUserActive(profileId, isActive);

  if ("error" in result && result.error) {
    return { error: result.error };
  }

  revalidateStaffPaths(panel);

  return { success: true as const };
}
