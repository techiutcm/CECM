import { AdminHeader } from "@/components/admin/admin-header";
import { StaffUsersPanel } from "@/components/admin/staff-users-panel";
import { requireAdminAccess } from "@/lib/admin/guard";
import { listStaffUsers } from "@/lib/admin/staff-users";

export default async function AdminUsersPage() {
  const user = await requireAdminAccess("admin");
  const users = await listStaffUsers("blog");

  return (
    <>
      <AdminHeader
        user={user}
        title="Usuarios del blog"
        description="Gestiona el personal con acceso al panel de contenido"
      />
      <div className="flex-1 p-8">
        <StaffUsersPanel panel="blog" users={users} variant="blog" />
      </div>
    </>
  );
}
