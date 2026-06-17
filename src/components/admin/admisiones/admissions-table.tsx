"use client";

import { AdmissionStatusBadge } from "@/components/admin/admisiones/admission-status-badge";
import {
  ADMISSION_GRADES,
  ADMISSION_SHIFTS,
} from "@/lib/admissions/constants";
import {
  ADMISSION_STATUSES,
  ADMISSION_STATUS_LABELS,
} from "@/lib/admissions/admin/constants";
import type { AdmissionListItem } from "@/lib/admissions/admin/types";
import { formatDate } from "@/lib/utils/date";
import { Eye } from "lucide-react";

interface AdmissionsTableProps {
  items: AdmissionListItem[];
  onSelect: (id: string) => void;
  filters: {
    search: string;
    status: string;
    grade: string;
    shift: string;
    sameSchool: string;
    dateFrom: string;
    dateTo: string;
  };
  onFilterChange: (key: string, value: string) => void;
}

export function AdmissionsTable({
  items,
  onSelect,
  filters,
  onFilterChange,
}: AdmissionsTableProps) {
  return (
    <div className="space-y-4">
      <div className="grid gap-3 rounded-2xl border border-[#083148]/10 bg-white p-4 md:grid-cols-2 xl:grid-cols-6">
        <input
          value={filters.search}
          onChange={(e) => onFilterChange("search", e.target.value)}
          placeholder="Buscar..."
          className="h-10 rounded-xl border border-[#083148]/10 px-3 text-sm outline-none focus:border-[#5B3E8C]/40"
        />
        <select
          value={filters.status}
          onChange={(e) => onFilterChange("status", e.target.value)}
          className="h-10 rounded-xl border border-[#083148]/10 px-3 text-sm outline-none"
        >
          <option value="all">Todos los estados</option>
          {ADMISSION_STATUSES.map((status) => (
            <option key={status} value={status}>
              {ADMISSION_STATUS_LABELS[status]}
            </option>
          ))}
        </select>
        <select
          value={filters.grade}
          onChange={(e) => onFilterChange("grade", e.target.value)}
          className="h-10 rounded-xl border border-[#083148]/10 px-3 text-sm outline-none"
        >
          <option value="all">Todos los grados</option>
          {ADMISSION_GRADES.map((grade) => (
            <option key={grade} value={grade}>
              {grade}
            </option>
          ))}
        </select>
        <select
          value={filters.shift}
          onChange={(e) => onFilterChange("shift", e.target.value)}
          className="h-10 rounded-xl border border-[#083148]/10 px-3 text-sm outline-none"
        >
          <option value="all">Todos los turnos</option>
          {ADMISSION_SHIFTS.map((shift) => (
            <option key={shift} value={shift}>
              {shift}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={filters.dateFrom}
          onChange={(e) => onFilterChange("dateFrom", e.target.value)}
          className="h-10 rounded-xl border border-[#083148]/10 px-3 text-sm outline-none"
        />
        <input
          type="date"
          value={filters.dateTo}
          onChange={(e) => onFilterChange("dateTo", e.target.value)}
          className="h-10 rounded-xl border border-[#083148]/10 px-3 text-sm outline-none"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#083148]/10 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-[#f7f9fc] text-left text-xs uppercase tracking-wide text-[#083148]/55">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Estudiante</th>
                <th className="px-4 py-3">Representante</th>
                <th className="px-4 py-3">Grado</th>
                <th className="px-4 py-3">Fecha</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#083148]/5">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-[#f7f9fc]/60">
                  <td className="px-4 py-3 font-mono text-xs text-[#083148]/50">
                    {item.id.slice(0, 8)}
                  </td>
                  <td className="px-4 py-3 font-medium text-[#083148]">{item.studentName}</td>
                  <td className="px-4 py-3 text-[#083148]/70">{item.representativeName}</td>
                  <td className="px-4 py-3 text-[#083148]/70">{item.grade}</td>
                  <td className="px-4 py-3 text-[#083148]/55">{formatDate(item.createdAt)}</td>
                  <td className="px-4 py-3">
                    <AdmissionStatusBadge status={item.status} />
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => onSelect(item.id)}
                      className="inline-flex items-center gap-1 rounded-lg border border-[#083148]/10 px-3 py-1.5 text-xs font-semibold text-[#083148] transition hover:bg-[#f7f9fc]"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      Ver
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {items.length === 0 && (
          <p className="px-6 py-10 text-center text-sm text-[#083148]/50">
            No hay solicitudes con los filtros seleccionados.
          </p>
        )}
      </div>
    </div>
  );
}
