import {
  ADMISSION_PRIORITY_LABELS,
  ADMISSION_STATUS_LABELS,
  type AdmissionPriority,
  type AdmissionStatus,
} from "@/lib/admissions/admin/constants";
import { cn } from "@/lib/utils";

const statusStyles: Record<AdmissionStatus, string> = {
  nueva: "bg-sky-50 text-sky-700 border-sky-200",
  documentos_pendientes: "bg-amber-50 text-amber-700 border-amber-200",
  documentos_verificados: "bg-indigo-50 text-indigo-700 border-indigo-200",
  entrevista_agendada: "bg-violet-50 text-violet-700 border-violet-200",
  entrevista_realizada: "bg-purple-50 text-purple-700 border-purple-200",
  aprobado: "bg-emerald-50 text-emerald-700 border-emerald-200",
  inscrito: "bg-teal-50 text-teal-700 border-teal-200",
  rechazado: "bg-red-50 text-red-700 border-red-200",
};

const priorityStyles: Record<AdmissionPriority, string> = {
  low: "bg-zinc-100 text-zinc-600",
  normal: "bg-[#083148]/8 text-[#083148]",
  high: "bg-orange-100 text-orange-700",
  urgent: "bg-red-100 text-red-700",
};

export function AdmissionStatusBadge({ status }: { status: AdmissionStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold",
        statusStyles[status],
      )}
    >
      {ADMISSION_STATUS_LABELS[status]}
    </span>
  );
}

export function AdmissionPriorityBadge({ priority }: { priority: AdmissionPriority }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
        priorityStyles[priority],
      )}
    >
      {ADMISSION_PRIORITY_LABELS[priority]}
    </span>
  );
}
