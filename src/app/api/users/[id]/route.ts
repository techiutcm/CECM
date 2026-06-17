import { jsonError, jsonOk } from "@/lib/api/response";
import { createClient } from "@/lib/supabase/server";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const supabase = await createClient();

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id, username, full_name, avatar_url, bio, created_at")
    .eq("id", id)
    .maybeSingle();

  if (error) return jsonError(error.message, 500);
  if (!profile) return jsonError("Usuario no encontrado", 404);

  const { data: roles } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", id);

  return jsonOk({
    ...profile,
    roles: (roles ?? []).map((r) => r.role),
  });
}
