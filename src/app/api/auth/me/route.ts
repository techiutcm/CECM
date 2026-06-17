import { getAuthUser } from "@/lib/api/auth";
import { jsonError, jsonOk } from "@/lib/api/response";

export async function GET() {
  const user = await getAuthUser();

  if (!user) {
    return jsonError("No autenticado", 401);
  }

  return jsonOk(user);
}
