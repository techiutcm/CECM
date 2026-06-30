import { AdmissionsHeader } from "@/components/admin/admisiones/admissions-header";
import { StaffUsersPanel } from "@/components/admin/staff-users-panel";
import { requireAdminAccess } from "@/lib/admin/guard";
import { listStaffUsers } from "@/lib/admin/staff-users";

export default async function ConfiguracionPage() {
  const user = await requireAdminAccess("admin");
  const users = await listStaffUsers("admisiones");

  return (
    <>
      <AdmissionsHeader
        user={user}
        title="Configuración"
        description="Personal autorizado y preferencias del módulo de admisiones"
      />

      <div className="flex-1 space-y-6 p-6">
        <StaffUsersPanel panel="admisiones" users={users} variant="admissions" />

        <section className="rounded-2xl border border-[#083148]/10 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-[#083148]">Estados del pipeline</h2>
          <ul className="mt-3 space-y-2 text-sm text-[#083148]/70">
            <li>Nueva Solicitud → Documentos Pendientes → Documentos Verificados</li>
            <li>Entrevista Agendada → Entrevista Realizada</li>
            <li>Aprobado → Inscrito</li>
            <li>Rechazado (estado final)</li>
          </ul>
        </section>

        <section className="rounded-2xl border border-[#083148]/10 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-[#083148]">Notificaciones por correo</h2>
          <p className="mt-2 text-sm text-[#083148]/60">
            Integración con Resend preparada. Agrega{" "}
            <code className="rounded bg-[#f7f9fc] px-1">RESEND_API_KEY</code> y{" "}
            <code className="rounded bg-[#f7f9fc] px-1">RESEND_FROM_EMAIL</code> en{" "}
            <code className="rounded bg-[#f7f9fc] px-1">.env.local</code> para activar el envío
            automático al agendar entrevistas.
          </p>
        </section>
      </div>
    </>
  );
}
