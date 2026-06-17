import { ActivityTimeline } from "@/components/admin/admisiones/activity-timeline";
import { AdmissionsHeader } from "@/components/admin/admisiones/admissions-header";
import { ChartBar, DonutChart, PieChart } from "@/components/admin/admisiones/charts";
import { KpiCard } from "@/components/admin/admisiones/kpi-card";
import { requireAdminAccess } from "@/lib/admin/guard";
import {
  getAdmissionDashboardStats,
  getRecentActivity,
} from "@/lib/admissions/admin/queries";
import {
  CalendarClock,
  CheckCircle2,
  Clock3,
  Inbox,
  XCircle,
} from "lucide-react";

export default async function AdmisionesDashboardPage() {
  const user = await requireAdminAccess("editor");
  const [stats, activity] = await Promise.all([
    getAdmissionDashboardStats(),
    getRecentActivity(8),
  ]);

  const weeklyTotal = stats.weeklyTrend.reduce((sum, item) => sum + item.count, 0);

  return (
    <>
      <AdmissionsHeader
        user={user}
        title="Dashboard de Admisiones"
        description="CRM educativo · seguimiento en tiempo real de solicitudes"
      />

      <div className="flex-1 space-y-6 p-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <KpiCard
            label="Nuevas Solicitudes"
            value={stats.nuevas}
            icon={Inbox}
            accent="blue"
            trend={`${weeklyTotal} esta semana`}
          />
          <KpiCard
            label="Entrevistas Pendientes"
            value={stats.entrevistasPendientes}
            icon={CalendarClock}
            accent="purple"
          />
          <KpiCard
            label="Admitidos"
            value={stats.admitidos}
            icon={CheckCircle2}
            accent="green"
          />
          <KpiCard
            label="En Revisión"
            value={stats.enRevision}
            icon={Clock3}
            accent="amber"
          />
          <KpiCard
            label="Rechazados"
            value={stats.rechazados}
            icon={XCircle}
            accent="red"
          />
        </div>

        <div className="rounded-2xl border border-[#083148]/10 bg-white p-5 shadow-sm">
          <h3 className="font-semibold text-[#083148]">Tendencia semanal</h3>
          <div className="mt-4 flex h-28 items-end gap-2">
            {stats.weeklyTrend.map((item) => {
              const max = Math.max(...stats.weeklyTrend.map((d) => d.count), 1);
              return (
                <div key={item.label} className="flex flex-1 flex-col items-center gap-2">
                  <div
                    className="w-full rounded-t-md bg-gradient-to-t from-[#5B3E8C] to-[#7C5CBF]"
                    style={{ height: `${(item.count / max) * 100}%`, minHeight: item.count ? 8 : 0 }}
                  />
                  <span className="text-[10px] font-medium capitalize text-[#083148]/55">
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          <ChartBar title="Solicitudes por mes" data={stats.byMonth} />
          <DonutChart title="Distribución por grado" data={stats.byGrade} />
          <PieChart
            title="Estado de solicitudes"
            data={stats.byStatus.filter((item) => item.count > 0).map((item) => ({
              label: item.label,
              count: item.count,
            }))}
          />
        </div>

        <ActivityTimeline items={activity} />
      </div>
    </>
  );
}
