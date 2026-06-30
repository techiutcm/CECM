"use client";

import { toggleStaffUserActiveAction } from "@/app/admin/actions/staff-users";
import type { StaffPanel, StaffUserRow } from "@/types/staff";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

interface StaffUsersTableProps {
  users: StaffUserRow[];
  panel: StaffPanel;
  variant?: "blog" | "admissions";
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-VE", {
    dateStyle: "medium",
  }).format(new Date(value));
}

export function StaffUsersTable({
  users,
  panel,
  variant = "blog",
}: StaffUsersTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const isAdmissions = variant === "admissions";

  function handleToggle(user: StaffUserRow) {
    const formData = new FormData();
    formData.set("profile_id", user.profileId);
    formData.set("panel", panel);
    formData.set("is_active", String(!user.isActive));

    startTransition(async () => {
      await toggleStaffUserActiveAction(formData);
      router.refresh();
    });
  }

  if (users.length === 0) {
    return (
      <p
        className={`px-6 py-12 text-center text-sm ${
          isAdmissions ? "text-[#083148]/50" : "text-zinc-500"
        }`}
      >
        No hay usuarios registrados en este panel.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead
          className={
            isAdmissions
              ? "border-b border-[#083148]/10 bg-[#f7f9fc] text-[#083148]/70"
              : "border-b border-zinc-200 bg-zinc-50 text-zinc-500"
          }
        >
          <tr>
            <th className="px-6 py-3 font-medium">Usuario</th>
            <th className="px-6 py-3 font-medium">Cargo</th>
            <th className="px-6 py-3 font-medium">Rol</th>
            <th className="px-6 py-3 font-medium">Estado</th>
            <th className="px-6 py-3 font-medium">Alta</th>
            <th className="px-6 py-3 font-medium">Acción</th>
          </tr>
        </thead>
        <tbody className={isAdmissions ? "divide-y divide-[#083148]/8" : "divide-y divide-zinc-100"}>
          {users.map((user) => (
            <tr key={user.profileId}>
              <td className="px-6 py-4">
                <p className={`font-medium ${isAdmissions ? "text-[#083148]" : "text-zinc-900"}`}>
                  {user.fullName ?? "Sin nombre"}
                </p>
                <p className={isAdmissions ? "text-[#083148]/55" : "text-zinc-500"}>
                  {user.email ?? user.username ?? user.profileId}
                </p>
              </td>
              <td className={`px-6 py-4 ${isAdmissions ? "text-[#083148]/75" : "text-zinc-600"}`}>
                {user.title ?? "—"}
              </td>
              <td className="px-6 py-4">
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                    isAdmissions
                      ? "bg-[#5B3E8C]/10 text-[#5B3E8C]"
                      : "bg-emerald-50 text-emerald-800"
                  }`}
                >
                  {user.roles.join(", ") || "—"}
                </span>
              </td>
              <td className="px-6 py-4">
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                    user.isActive
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-zinc-100 text-zinc-500"
                  }`}
                >
                  {user.isActive ? "Activo" : "Inactivo"}
                </span>
              </td>
              <td className={`px-6 py-4 ${isAdmissions ? "text-[#083148]/60" : "text-zinc-500"}`}>
                {formatDate(user.createdAt)}
              </td>
              <td className="px-6 py-4">
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => handleToggle(user)}
                  className={`text-xs font-semibold disabled:opacity-50 ${
                    isAdmissions
                      ? "text-[#5B3E8C] hover:underline"
                      : "text-emerald-700 hover:underline"
                  }`}
                >
                  {user.isActive ? "Desactivar" : "Activar"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
