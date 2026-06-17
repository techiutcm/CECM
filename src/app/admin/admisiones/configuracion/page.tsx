import { AdmissionsHeader } from "@/components/admin/admisiones/admissions-header";
import { requireAdminAccess } from "@/lib/admin/guard";

export default async function ConfiguracionPage() {
  const user = await requireAdminAccess("admin");

  return (
    <>
      <AdmissionsHeader
        user={user}
        title="Configuración"
        description="Preferencias del módulo de admisiones y personal autorizado"
      />

      <div className="flex-1 space-y-6 p-6">
        <section className="rounded-2xl border border-[#083148]/10 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-[#083148]">Personal de admisiones</h2>
          <p className="mt-2 text-sm text-[#083148]/60">
            Los usuarios con rol <strong>editor</strong> o <strong>admin</strong> pueden gestionar
            solicitudes. La tabla <code>staff_users</code> permite extender perfiles con departamento
            y cargo.
          </p>
        </section>

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
