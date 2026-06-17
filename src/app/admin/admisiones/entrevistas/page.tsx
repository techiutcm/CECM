import { AdmissionsHeader } from "@/components/admin/admisiones/admissions-header";
import { InterviewsCalendar } from "@/components/admin/admisiones/interviews-calendar";
import { requireAdminAccess } from "@/lib/admin/guard";
import { getInterviews } from "@/lib/admissions/admin/queries";
import { isResendConfigured } from "@/lib/email/resend";

export default async function EntrevistasPage() {
  const user = await requireAdminAccess("editor");
  const interviews = await getInterviews();
  const resendReady = isResendConfigured();

  const upcoming = interviews.filter((item) => item.status === "scheduled");

  return (
    <>
      <AdmissionsHeader
        user={user}
        title="Entrevistas"
        description="Calendario interactivo de entrevistas de admisión"
      />

      <div className="flex-1 space-y-6 p-6">
        {!resendReady && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            El envío de correos con Resend está pendiente. Configura{" "}
            <code className="rounded bg-white px-1">RESEND_API_KEY</code> en{" "}
            <code className="rounded bg-white px-1">.env.local</code> para activarlo.
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-3">
          <StatCard label="Programadas" value={upcoming.length} />
          <StatCard
            label="Esta semana"
            value={
              upcoming.filter((item) => {
                const date = new Date(item.scheduled_at);
                const now = new Date();
                const weekEnd = new Date(now);
                weekEnd.setDate(now.getDate() + 7);
                return date >= now && date <= weekEnd;
              }).length
            }
          />
          <StatCard label="Total registradas" value={interviews.length} />
        </div>

        <InterviewsCalendar interviews={interviews} />
      </div>
    </>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-[#083148]/10 bg-white p-5 shadow-sm">
      <p className="text-sm text-[#083148]/55">{label}</p>
      <p className="mt-2 text-3xl font-bold text-[#083148]">{value}</p>
    </div>
  );
}
