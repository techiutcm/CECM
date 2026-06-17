import { requireAuth } from "@/lib/api/auth";
import { jsonError, jsonOk } from "@/lib/api/response";
import { updateProfileSchema } from "@/lib/api/validations";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const auth = await requireAuth();
  if (!auth.user) return jsonError(auth.error!, auth.status);

  return jsonOk(auth.user.profile);
}

export async function PATCH(request: Request) {
  const auth = await requireAuth();
  if (!auth.user) return jsonError(auth.error!, auth.status);

  const body = await request.json();
  const parsed = updateProfileSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Datos inválidos");
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .update(parsed.data)
    .eq("id", auth.user.id)
    .select("*")
    .single();

  if (error) return jsonError(error.message, 500);
  return jsonOk(data);
}
