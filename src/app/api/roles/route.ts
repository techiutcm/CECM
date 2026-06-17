import { requireAuth } from "@/lib/api/auth";
import { jsonCreated, jsonError } from "@/lib/api/response";
import { assignRoleSchema } from "@/lib/api/validations";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const auth = await requireAuth("admin");
  if (!auth.user) return jsonError(auth.error!, auth.status);

  const body = await request.json();
  const parsed = assignRoleSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Datos inválidos");
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("user_roles")
    .upsert(
      {
        user_id: parsed.data.user_id,
        role: parsed.data.role,
        granted_by: auth.user.id,
      },
      { onConflict: "user_id,role" },
    )
    .select("*")
    .single();

  if (error) return jsonError(error.message, 500);
  return jsonCreated(data);
}
