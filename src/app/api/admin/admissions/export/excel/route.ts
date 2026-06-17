import { requireAuth } from "@/lib/api/auth";
import {
  getAdmissionsForExport,
  getExportSummary,
} from "@/lib/admissions/admin/export-data";
import { buildAdmissionsExcelBuffer } from "@/lib/admissions/admin/export-excel";

export async function GET() {
  const auth = await requireAuth("editor");
  if (!auth.user) {
    return new Response(JSON.stringify({ error: auth.error }), { status: auth.status });
  }

  try {
    const rows = await getAdmissionsForExport();
    const buffer = buildAdmissionsExcelBuffer(rows);
    const filename = `admisiones-${new Date().toISOString().slice(0, 10)}.xlsx`;

    return new Response(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error al exportar";
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
}
