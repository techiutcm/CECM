import { requireAuth } from "@/lib/api/auth";
import { jsonError, jsonOk } from "@/lib/api/response";
import { getAdmissionDetail } from "@/lib/admissions/admin/queries";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAuth("editor");
  if (!auth.user) return jsonError(auth.error!, auth.status);

  const { id } = await params;
  const detail = await getAdmissionDetail(id);

  if (!detail) return jsonError("Solicitud no encontrada", 404);
  return jsonOk(detail);
}
