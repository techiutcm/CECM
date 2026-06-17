"use client";

import {
  AdmissionPriorityBadge,
  AdmissionStatusBadge,
} from "@/components/admin/admisiones/admission-status-badge";
import { KANBAN_COLUMNS } from "@/lib/admissions/admin/constants";
import type { AdmissionListItem } from "@/lib/admissions/admin/types";
import { formatDate } from "@/lib/utils/date";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { User } from "lucide-react";

interface KanbanBoardProps {
  items: AdmissionListItem[];
  onSelect: (id: string) => void;
}

export function KanbanBoard({ items, onSelect }: KanbanBoardProps) {
  return (
    <div className="grid gap-4 xl:grid-cols-5">
      {KANBAN_COLUMNS.map((column) => {
        const columnItems = items.filter((item) => column.statuses.includes(item.status));

        return (
          <div key={column.id} className="min-w-[240px] rounded-2xl border border-[#083148]/10 bg-[#f7f9fc] p-3">
            <div className="mb-3 flex items-center justify-between px-1">
              <h3 className="text-sm font-semibold text-[#083148]">{column.label}</h3>
              <span className="rounded-full bg-white px-2 py-0.5 text-xs font-bold text-[#083148]/60">
                {columnItems.length}
              </span>
            </div>

            <div className="space-y-3">
              {columnItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelect(item.id)}
                  className={cn(
                    "w-full rounded-2xl border border-white bg-white p-4 text-left shadow-sm transition",
                    "hover:-translate-y-0.5 hover:border-[#5B3E8C]/20 hover:shadow-md",
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-[#083148]/8">
                      {item.studentPhoto ? (
                        <Image
                          src={item.studentPhoto}
                          alt={item.studentName}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <User className="h-4 w-4 text-[#083148]/40" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-[#083148]">{item.studentName}</p>
                      <p className="mt-0.5 text-xs text-[#083148]/55">{item.grade}</p>
                    </div>
                  </div>

                  <div className="mt-3 space-y-2">
                    <p className="text-xs text-[#083148]/65">
                      <span className="font-medium">Representante:</span> {item.representativeName}
                    </p>
                    <p className="text-xs text-[#083148]/45">{formatDate(item.createdAt)}</p>
                    <div className="flex flex-wrap items-center gap-2">
                      <AdmissionStatusBadge status={item.status} />
                      <AdmissionPriorityBadge priority={item.priority} />
                    </div>
                  </div>
                </button>
              ))}

              {columnItems.length === 0 && (
                <div className="rounded-xl border border-dashed border-[#083148]/10 px-3 py-8 text-center text-xs text-[#083148]/40">
                  Sin solicitudes
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
