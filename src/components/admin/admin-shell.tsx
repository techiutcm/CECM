"use client";

import { AdmissionsSidebar } from "@/components/admin/admisiones/admissions-sidebar";
import { Sidebar } from "@/components/admin/sidebar";
import type { BlogRole } from "@/types/blog";
import { usePathname } from "next/navigation";

interface AdminShellProps {
  roles: BlogRole[];
  children: React.ReactNode;
}

export function AdminShell({ roles, children }: AdminShellProps) {
  const pathname = usePathname();
  const isAdmissions = pathname.startsWith("/admin/admisiones");

  return (
    <div className={`flex min-h-screen ${isAdmissions ? "bg-[#f4f6fa]" : "bg-zinc-50"}`}>
      {isAdmissions ? <AdmissionsSidebar roles={roles} /> : <Sidebar roles={roles} />}
      <div className="flex min-w-0 flex-1 flex-col">{children}</div>
    </div>
  );
}
