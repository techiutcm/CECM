import { hasRole } from "@/lib/auth/roles";
import { createClient } from "@/lib/supabase/server";
import type { AuthUser, BlogRole, Profile } from "@/types/blog";

export async function getAuthUser(): Promise<AuthUser | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const [{ data: profile }, { data: roles }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
    supabase.from("user_roles").select("role").eq("user_id", user.id),
  ]);

  return {
    id: user.id,
    email: user.email,
    profile: profile as Profile | null,
    roles: (roles ?? []).map((r) => r.role as BlogRole),
  };
}

export { hasRole } from "@/lib/auth/roles";

export async function requireAuth(minRole: BlogRole = "reader") {
  const user = await getAuthUser();

  if (!user) {
    return { error: "No autenticado", status: 401 as const, user: null };
  }

  if (!hasRole(user.roles, minRole)) {
    return {
      error: `Se requiere rol: ${minRole}`,
      status: 403 as const,
      user: null,
    };
  }

  return { error: null, status: 200 as const, user };
}
