"use client";

import {
  sendInterviewNotificationAction,
  updateInterviewStatusAction,
} from "@/app/admin/actions/admissions";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import type { InterviewRow } from "@/lib/admissions/admin/types";
import { formatDateTime } from "@/lib/utils/date";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  Calendar,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  List,
  Mail,
  X,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState, useTransition } from "react";

type CalendarView = "month" | "week" | "agenda";

interface InterviewsCalendarProps {
  interviews: InterviewRow[];
}

const WEEKDAY_LABELS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const MONTH_LABELS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

function startOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function getWeekStart(date: Date) {
  const d = startOfDay(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d;
}

function getMonthGrid(cursor: Date) {
  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstDay = new Date(year, month, 1);
  const startOffset = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: Date[] = [];

  for (let i = startOffset; i > 0; i--) {
    cells.push(new Date(year, month, 1 - i));
  }
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push(new Date(year, month, day));
  }
  while (cells.length % 7 !== 0) {
    const last = cells[cells.length - 1];
    cells.push(new Date(last.getFullYear(), last.getMonth(), last.getDate() + 1));
  }

  return cells;
}

function getWeekDays(cursor: Date) {
  const start = getWeekStart(cursor);
  return Array.from({ length: 7 }).map((_, index) => {
    const day = new Date(start);
    day.setDate(start.getDate() + index);
    return day;
  });
}

export function InterviewsCalendar({ interviews }: InterviewsCalendarProps) {
  const { toast } = useToast();
  const [view, setView] = useState<CalendarView>("month");
  const [cursor, setCursor] = useState(() => new Date());
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const selectedInterview = interviews.find((item) => item.id === selectedId) ?? null;

  const interviewsByDay = useMemo(() => {
    const map = new Map<string, InterviewRow[]>();
    interviews.forEach((interview) => {
      const key = startOfDay(new Date(interview.scheduled_at)).toISOString();
      const list = map.get(key) ?? [];
      list.push(interview);
      map.set(key, list);
    });
    return map;
  }, [interviews]);

  const monthCells = useMemo(() => getMonthGrid(cursor), [cursor]);
  const weekDays = useMemo(() => getWeekDays(cursor), [cursor]);

  const agendaItems = useMemo(
    () => [...interviews].sort((a, b) => a.scheduled_at.localeCompare(b.scheduled_at)),
    [interviews],
  );

  function navigate(direction: -1 | 1) {
    const next = new Date(cursor);
    if (view === "month") next.setMonth(cursor.getMonth() + direction);
    else if (view === "week") next.setDate(cursor.getDate() + direction * 7);
    else next.setMonth(cursor.getMonth() + direction);
    setCursor(next);
  }

  function getEventsForDate(date: Date) {
    return interviewsByDay.get(startOfDay(date).toISOString()) ?? [];
  }

  function runAction(action: () => Promise<{ error?: string; success?: boolean; message?: string; skipped?: boolean }>) {
    startTransition(async () => {
      const result = await action();
      if (result.error) {
        toast({ title: "Error", description: result.error, variant: "error" });
        return;
      }
      toast({
        title: result.skipped ? "Correo pendiente" : "Acción completada",
        description: result.message ?? "Actualizado correctamente.",
        variant: result.skipped ? "default" : "success",
      });
    });
  }

  const headerLabel =
    view === "week"
      ? `Semana del ${weekDays[0].toLocaleDateString("es-VE", { day: "numeric", month: "short" })}`
      : `${MONTH_LABELS[cursor.getMonth()]} ${cursor.getFullYear()}`;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 rounded-2xl border border-[#083148]/10 bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-lg border border-[#083148]/10 p-2 text-[#083148] hover:bg-[#f7f9fc]"
            aria-label="Anterior"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setCursor(new Date())}
            className="rounded-lg border border-[#083148]/10 px-3 py-2 text-sm font-semibold text-[#083148] hover:bg-[#f7f9fc]"
          >
            Hoy
          </button>
          <button
            type="button"
            onClick={() => navigate(1)}
            className="rounded-lg border border-[#083148]/10 p-2 text-[#083148] hover:bg-[#f7f9fc]"
            aria-label="Siguiente"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <h2 className="ml-2 text-lg font-bold capitalize text-[#083148]">{headerLabel}</h2>
        </div>

        <div className="flex rounded-xl border border-[#083148]/10 bg-[#f7f9fc] p-1">
          {([
            { id: "month" as const, label: "Mes", icon: Calendar },
            { id: "week" as const, label: "Semana", icon: CalendarDays },
            { id: "agenda" as const, label: "Agenda", icon: List },
          ]).map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setView(item.id)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition",
                  view === item.id ? "bg-[#083148] text-white" : "text-[#083148]/60",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {view === "month" && (
        <div className="overflow-hidden rounded-2xl border border-[#083148]/10 bg-white shadow-sm">
          <div className="grid grid-cols-7 border-b border-[#083148]/10 bg-[#f7f9fc]">
            {WEEKDAY_LABELS.map((label) => (
              <div key={label} className="px-2 py-3 text-center text-xs font-semibold uppercase text-[#083148]/55">
                {label}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {monthCells.map((date) => {
              const events = getEventsForDate(date);
              const inMonth = date.getMonth() === cursor.getMonth();
              const isToday = isSameDay(date, new Date());

              return (
                <button
                  key={date.toISOString()}
                  type="button"
                  onClick={() => events[0] && setSelectedId(events[0].id)}
                  className={cn(
                    "min-h-28 border-b border-r border-[#083148]/5 p-2 text-left transition hover:bg-[#f7f9fc]/80",
                    !inMonth && "bg-[#fafbfc] text-[#083148]/35",
                  )}
                >
                  <span
                    className={cn(
                      "inline-flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold",
                      isToday && "bg-[#5B3E8C] text-white",
                    )}
                  >
                    {date.getDate()}
                  </span>
                  <div className="mt-2 space-y-1">
                    {events.slice(0, 2).map((event) => (
                      <div
                        key={event.id}
                        className="truncate rounded-md bg-[#5B3E8C]/10 px-1.5 py-1 text-[10px] font-medium text-[#5B3E8C]"
                      >
                        {new Date(event.scheduled_at).toLocaleTimeString("es-VE", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                        {event.student_name}
                      </div>
                    ))}
                    {events.length > 2 && (
                      <p className="text-[10px] text-[#083148]/45">+{events.length - 2} más</p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {view === "week" && (
        <div className="grid gap-3 lg:grid-cols-7">
          {weekDays.map((date) => {
            const events = getEventsForDate(date);
            const isToday = isSameDay(date, new Date());
            return (
              <div
                key={date.toISOString()}
                className={cn(
                  "rounded-2xl border border-[#083148]/10 bg-white p-3 shadow-sm",
                  isToday && "ring-2 ring-[#5B3E8C]/30",
                )}
              >
                <p className="text-xs font-semibold uppercase text-[#083148]/55">
                  {date.toLocaleDateString("es-VE", { weekday: "short" })}
                </p>
                <p className="text-2xl font-bold text-[#083148]">{date.getDate()}</p>
                <div className="mt-3 space-y-2">
                  {events.length === 0 ? (
                    <p className="text-xs text-[#083148]/40">Sin entrevistas</p>
                  ) : (
                    events.map((event) => (
                      <button
                        key={event.id}
                        type="button"
                        onClick={() => setSelectedId(event.id)}
                        className="w-full rounded-xl bg-[#5B3E8C]/8 p-2 text-left transition hover:bg-[#5B3E8C]/12"
                      >
                        <p className="text-xs font-semibold text-[#5B3E8C]">
                          {new Date(event.scheduled_at).toLocaleTimeString("es-VE", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                        <p className="mt-1 text-sm font-medium text-[#083148]">{event.student_name}</p>
                      </button>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {view === "agenda" && (
        <div className="rounded-2xl border border-[#083148]/10 bg-white shadow-sm">
          <div className="divide-y divide-[#083148]/5">
            {agendaItems.length === 0 ? (
              <p className="px-5 py-10 text-center text-sm text-[#083148]/50">
                No hay entrevistas programadas.
              </p>
            ) : (
              agendaItems.map((event) => (
                <button
                  key={event.id}
                  type="button"
                  onClick={() => setSelectedId(event.id)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-[#f7f9fc]"
                >
                  <div>
                    <p className="font-medium text-[#083148]">{event.student_name}</p>
                    <p className="text-sm text-[#083148]/55">{event.grade} · {event.representative_name}</p>
                    <p className="mt-1 text-xs text-[#083148]/45">{formatDateTime(event.scheduled_at)}</p>
                  </div>
                  <span className="rounded-full bg-[#5B3E8C]/10 px-2.5 py-1 text-xs font-semibold capitalize text-[#5B3E8C]">
                    {event.status}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      )}

      <AnimatePresence>
        {selectedInterview && (
          <>
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedId(null)}
              className="fixed inset-0 z-40 bg-[#06121a]/40 backdrop-blur-sm"
              aria-label="Cerrar detalle"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-[#083148]/10 bg-white shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-[#083148]/10 px-5 py-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-[#083148]/45">Entrevista</p>
                  <h3 className="text-lg font-bold text-[#083148]">{selectedInterview.student_name}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedId(null)}
                  className="rounded-lg border border-[#083148]/10 p-2"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="flex-1 space-y-4 overflow-y-auto p-5">
                <DetailItem label="Fecha y hora" value={formatDateTime(selectedInterview.scheduled_at)} />
                <DetailItem label="Grado" value={selectedInterview.grade} />
                <DetailItem label="Representante" value={selectedInterview.representative_name} />
                <DetailItem label="Correo" value={selectedInterview.representative_email || "—"} />
                <DetailItem label="Teléfono" value={selectedInterview.representative_phone || "—"} />
                <DetailItem label="Estado" value={selectedInterview.status} />
                <DetailItem
                  label="Notificación"
                  value={selectedInterview.notification_sent ? "Enviada" : "Pendiente"}
                />
                {selectedInterview.notes && (
                  <DetailItem label="Observaciones" value={selectedInterview.notes} />
                )}

                <div className="flex flex-wrap gap-2 pt-2">
                  <Button
                    type="button"
                    size="sm"
                    disabled={isPending}
                    onClick={() =>
                      runAction(() => updateInterviewStatusAction(selectedInterview.id, "completed"))
                    }
                  >
                    Marcar realizada
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={isPending}
                    onClick={() =>
                      runAction(() => updateInterviewStatusAction(selectedInterview.id, "cancelled"))
                    }
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={isPending}
                    onClick={() => runAction(() => sendInterviewNotificationAction(selectedInterview.id))}
                  >
                    <Mail className="h-3.5 w-3.5" />
                    Enviar correo
                  </Button>
                </div>

                <Link
                  href={`/admin/admisiones/solicitudes`}
                  className="inline-flex text-sm font-semibold text-[#5B3E8C] hover:underline"
                >
                  Ver solicitud en CRM →
                </Link>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-[#083148]/45">{label}</p>
      <p className="mt-1 text-sm font-medium text-[#083148]">{value}</p>
    </div>
  );
}
