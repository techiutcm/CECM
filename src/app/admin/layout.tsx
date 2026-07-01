import { AdminShell } from "@/components/admin/admin-shell";
import { requireAnyAdminAccess } from "@/lib/admin/guard";
import { getPendingCommentsCount } from "@/lib/admin/queries";
import { hasRole } from "@/lib/api/auth";

export const metadata = {
  title: "Panel de administración",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAnyAdminAccess();
  const pendingCommentsCount = hasRole(user.roles, "editor")
    ? await getPendingCommentsCount()
    : 0;

  return (
    <AdminShell roles={user.roles} pendingCommentsCount={pendingCommentsCount}>
      {children}
    </AdminShell>
  );
}
