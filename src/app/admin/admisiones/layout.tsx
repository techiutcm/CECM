import { ToastProvider } from "@/components/ui/toast";
import { requireAdminAccess } from "@/lib/admin/guard";

export default async function AdmisionesAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdminAccess("editor");

  return <ToastProvider>{children}</ToastProvider>;
}
