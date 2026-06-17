import { requireAuth } from "@/lib/api/auth";
import {
  getAdmissionsForExport,
  getExportSummary,
} from "@/lib/admissions/admin/export-data";
import { buildAdmissionsPdfBuffer } from "@/lib/admissions/admin/export-pdf";

export async function GET() {
  const auth = await requireAuth("editor");
  if (!auth.user) {
    return new Response(JSON.stringify({ error: auth.error }), { status: auth.status });
  }

  try {
    const [rows, summary] = await Promise.all([getAdmissionsForExport(), getExportSummary()]);
    const buffer = buildAdmissionsPdfBuffer(rows, summary);
    const filename = `reporte-admisiones-${new Date().toISOString().slice(0, 10)}.pdf`;

    return new Response(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error al exportar";
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
}
