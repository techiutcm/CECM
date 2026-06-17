import { getAuthUser } from "@/lib/api/auth";
import { getPostLoginRedirect } from "@/lib/auth/post-login";
import { jsonError, jsonOk } from "@/lib/api/response";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const user = await getAuthUser();

  if (!user) {
    return jsonError("No autenticado", 401);
  }

  const { searchParams } = new URL(request.url);
  const explicitRedirect = searchParams.get("redirect");

  const supabase = await createClient();
  const { data: staff } = await supabase
    .from("staff_users")
    .select("department")
    .eq("profile_id", user.id)
    .maybeSingle();

  const path = getPostLoginRedirect(user, {
    explicitRedirect,
    staffDepartment: staff?.department ?? null,
  });

  return jsonOk({ path });
}
