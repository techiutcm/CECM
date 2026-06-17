import { AdmissionsHeader } from "@/components/admin/admisiones/admissions-header";
import { SolicitudesClient } from "@/components/admin/admisiones/solicitudes-client";
import { requireAdminAccess } from "@/lib/admin/guard";
import { getAllAdmissions } from "@/lib/admissions/admin/queries";

export default async function SolicitudesPage() {
  const user = await requireAdminAccess("editor");
  const items = await getAllAdmissions();

  return (
    <>
      <AdmissionsHeader
        user={user}
        title="Solicitudes"
        description="Gestión CRM con vista Kanban y tabla avanzada"
      />
      <div className="flex-1 p-6">
        <SolicitudesClient initialItems={items} />
      </div>
    </>
  );
}
