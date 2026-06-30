import { CreateStaffUserForm } from "@/components/admin/create-staff-user-form";
import { StaffUsersTable } from "@/components/admin/staff-users-table";
import type { StaffPanel, StaffUserRow } from "@/types/staff";

interface StaffUsersPanelProps {
  panel: StaffPanel;
  users: StaffUserRow[];
  variant?: "blog" | "admissions";
}

export function StaffUsersPanel({ panel, users, variant = "blog" }: StaffUsersPanelProps) {
  const isAdmissions = variant === "admissions";

  return (
    <div className="space-y-6">
      <section
        className={
          isAdmissions
            ? "rounded-2xl border border-[#083148]/10 bg-white p-5 shadow-sm"
            : "rounded-xl border border-zinc-200 bg-white p-6 shadow-sm"
        }
      >
        <h2
          className={`text-sm font-semibold ${
            isAdmissions ? "text-[#083148]" : "text-zinc-900"
          }`}
        >
          Agregar usuario
        </h2>
        <p
          className={`mt-1 text-sm ${
            isAdmissions ? "text-[#083148]/60" : "text-zinc-500"
          }`}
        >
          Crea una cuenta con acceso al panel{" "}
          {panel === "blog" ? "del blog" : "de admisiones"}.
        </p>
        <div className="mt-5">
          <CreateStaffUserForm panel={panel} />
        </div>
      </section>

      <section
        className={
          isAdmissions
            ? "overflow-hidden rounded-2xl border border-[#083148]/10 bg-white shadow-sm"
            : "overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm"
        }
      >
        <div
          className={
            isAdmissions
              ? "border-b border-[#083148]/10 px-6 py-4"
              : "border-b border-zinc-200 px-6 py-4"
          }
        >
          <h2
            className={`font-semibold ${
              isAdmissions ? "text-[#083148]" : "text-zinc-900"
            }`}
          >
            Usuarios ({users.length})
          </h2>
        </div>
        <StaffUsersTable users={users} panel={panel} variant={variant} />
      </section>
    </div>
  );
}
