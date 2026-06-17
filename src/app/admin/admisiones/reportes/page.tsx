import { AdmissionsHeader } from "@/components/admin/admisiones/admissions-header";
import { ExportActions } from "@/components/admin/admisiones/export-actions";
import { ChartBar, DonutChart } from "@/components/admin/admisiones/charts";
import { requireAdminAccess } from "@/lib/admin/guard";
import { getAdmissionDashboardStats } from "@/lib/admissions/admin/queries";

export default async function ReportesPage() {
  const user = await requireAdminAccess("editor");
  const stats = await getAdmissionDashboardStats();

  const approvalRate =
    stats.total > 0 ? Math.round((stats.admitidos / stats.total) * 100) : 0;
  const conversionRate =
    stats.total > 0
      ? Math.round(
          (stats.byStatus.find((s) => s.status === "inscrito")?.count ?? 0) / stats.total * 100,
        )
      : 0;

  const procedencia = stats.byGrade.map((item) => ({
    label: item.label,
    count: item.count,
  }));

  return (
    <>
      <AdmissionsHeader
        user={user}
        title="Reportes"
        description="Métricas de admisión, conversión y procedencia"
      />

      <div className="flex-1 space-y-6 p-6">
        <div className="grid gap-4 md:grid-cols-4">
          <MetricCard label="Total solicitudes" value={stats.total} />
          <MetricCard label="Tasa de aprobación" value={`${approvalRate}%`} />
          <MetricCard label="Tasa de conversión" value={`${conversionRate}%`} />
          <MetricCard label="Rechazados" value={stats.rechazados} />
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <ChartBar title="Solicitudes por período" data={stats.byMonth} />
          <DonutChart title="Solicitudes por grado" data={stats.byGrade} />
        </div>

        <div className="rounded-2xl border border-[#083148]/10 bg-white p-5 shadow-sm">
          <h3 className="font-semibold text-[#083148]">Procedencia de estudiantes</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {procedencia.map((item) => (
              <div key={item.label} className="rounded-xl bg-[#f7f9fc] px-4 py-3">
                <p className="text-sm text-[#083148]/60">{item.label}</p>
                <p className="text-xl font-bold text-[#083148]">{item.count}</p>
              </div>
            ))}
          </div>
        </div>

        <ExportActions />
      </div>
    </>
  );
}

function MetricCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-[#083148]/10 bg-white p-5 shadow-sm">
      <p className="text-sm text-[#083148]/55">{label}</p>
      <p className="mt-2 text-3xl font-bold text-[#083148]">{value}</p>
    </div>
  );
}
