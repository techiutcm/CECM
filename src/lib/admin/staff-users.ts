import { STAFF_PANEL_CONFIG, type StaffPanel, type StaffUserRow } from "@/types/staff";
import type { BlogRole } from "@/types/blog";
import { createServiceClient } from "@/lib/supabase/service";

interface CreateStaffUserInput {
  email: string;
  password: string;
  fullName: string;
  title: string;
  panel: StaffPanel;
}

export async function createStaffUser(input: CreateStaffUserInput) {
  const config = STAFF_PANEL_CONFIG[input.panel];
  const supabase = createServiceClient();

  const { data: created, error: createError } = await supabase.auth.admin.createUser({
    email: input.email,
    password: input.password,
    email_confirm: true,
    user_metadata: { full_name: input.fullName },
  });

  if (createError) {
    return { error: createError.message };
  }

  const userId = created.user.id;
  const username = input.email.split("@")[0].slice(0, 30);

  const { error: profileError } = await supabase.from("profiles").upsert({
    id: userId,
    full_name: input.fullName,
    username,
  });

  if (profileError) {
    return { error: profileError.message };
  }

  const { error: roleError } = await supabase.from("user_roles").insert({
    user_id: userId,
    role: config.role,
  });

  if (roleError && !roleError.message.includes("duplicate")) {
    return { error: roleError.message };
  }

  const { error: staffError } = await supabase.from("staff_users").upsert({
    profile_id: userId,
    department: config.department,
    title: input.title,
    is_active: true,
  });

  if (staffError) {
    return { error: staffError.message };
  }

  return {
    success: true as const,
    userId,
    email: input.email,
    role: config.role,
    department: config.department,
  };
}

export async function listStaffUsers(panel: StaffPanel): Promise<StaffUserRow[]> {
  const config = STAFF_PANEL_CONFIG[panel];
  const supabase = createServiceClient();

  const { data: staffRows, error } = await supabase
    .from("staff_users")
    .select(
      "profile_id, department, title, is_active, created_at, profiles(full_name, username)",
    )
    .eq("department", config.department)
    .order("created_at", { ascending: false });

  if (error || !staffRows?.length) {
    return [];
  }

  const profileIds = staffRows.map((row) => row.profile_id);

  const [{ data: roleRows }, { data: authData }] = await Promise.all([
    supabase.from("user_roles").select("user_id, role").in("user_id", profileIds),
    supabase.auth.admin.listUsers({ perPage: 1000 }),
  ]);

  const emailById = new Map(
    authData.users.map((user) => [user.id, user.email ?? null]),
  );

  const rolesByUser = new Map<string, BlogRole[]>();
  roleRows?.forEach((row) => {
    const current = rolesByUser.get(row.user_id) ?? [];
    current.push(row.role as BlogRole);
    rolesByUser.set(row.user_id, current);
  });

  return staffRows.map((row) => {
    const profile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;

    return {
      profileId: row.profile_id,
      email: emailById.get(row.profile_id) ?? null,
      fullName: profile?.full_name ?? null,
      username: profile?.username ?? null,
      department: row.department,
      title: row.title,
      isActive: row.is_active,
      roles: rolesByUser.get(row.profile_id) ?? [],
      createdAt: row.created_at,
    };
  });
}

export async function setStaffUserActive(profileId: string, isActive: boolean) {
  const supabase = createServiceClient();

  const { error } = await supabase
    .from("staff_users")
    .update({ is_active: isActive })
    .eq("profile_id", profileId);

  if (error) {
    return { error: error.message };
  }

  return { success: true as const };
}
