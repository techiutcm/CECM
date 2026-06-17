"use client";

import { AdmissionDetailDrawer } from "@/components/admin/admisiones/admission-detail-drawer";
import { AdmissionsTable } from "@/components/admin/admisiones/admissions-table";
import { KanbanBoard } from "@/components/admin/admisiones/kanban-board";
import type { AdmissionListItem } from "@/lib/admissions/admin/types";
import { cn } from "@/lib/utils";
import { LayoutGrid, Table2 } from "lucide-react";
import { useMemo, useState } from "react";

interface SolicitudesClientProps {
  initialItems: AdmissionListItem[];
}

export function SolicitudesClient({ initialItems }: SolicitudesClientProps) {
  const [view, setView] = useState<"kanban" | "table">("kanban");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    grade: "all",
    shift: "all",
    sameSchool: "all",
    dateFrom: "",
    dateTo: "",
  });

  const filteredItems = useMemo(() => {
    return initialItems.filter((item) => {
      if (filters.status !== "all" && item.status !== filters.status) return false;
      if (filters.grade !== "all" && item.grade !== filters.grade) return false;
      if (filters.shift !== "all" && item.shift !== filters.shift) return false;
      if (filters.dateFrom && item.createdAt < filters.dateFrom) return false;
      if (filters.dateTo && item.createdAt > `${filters.dateTo}T23:59:59`) return false;
      if (filters.search.trim()) {
        const q = filters.search.toLowerCase();
        const haystack = [item.studentName, item.representativeName, item.id].join(" ").toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [filters, initialItems]);

  const kanbanItems = filteredItems.filter((item) => item.status !== "rechazado");

  return (
    <>
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm text-[#083148]/60">
            {filteredItems.length} solicitudes · Vista CRM
          </p>
        </div>
        <div className="flex rounded-xl border border-[#083148]/10 bg-white p-1">
          <button
            type="button"
            onClick={() => setView("kanban")}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition",
              view === "kanban" ? "bg-[#083148] text-white" : "text-[#083148]/60",
            )}
          >
            <LayoutGrid className="h-4 w-4" />
            Kanban
          </button>
          <button
            type="button"
            onClick={() => setView("table")}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition",
              view === "table" ? "bg-[#083148] text-white" : "text-[#083148]/60",
            )}
          >
            <Table2 className="h-4 w-4" />
            Tabla
          </button>
        </div>
      </div>

      {view === "kanban" ? (
        <KanbanBoard items={kanbanItems} onSelect={setSelectedId} />
      ) : (
        <AdmissionsTable
          items={filteredItems}
          onSelect={setSelectedId}
          filters={filters}
          onFilterChange={(key, value) => setFilters((current) => ({ ...current, [key]: value }))}
        />
      )}

      <AdmissionDetailDrawer admissionId={selectedId} onClose={() => setSelectedId(null)} />
    </>
  );
}
