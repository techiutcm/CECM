import { AdminShell } from "@/components/admin/admin-shell";
import { requireAnyAdminAccess } from "@/lib/admin/guard";

export const metadata = {
  title: "Panel de administración",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAnyAdminAccess();

  return <AdminShell roles={user.roles}>{children}</AdminShell>;
}
