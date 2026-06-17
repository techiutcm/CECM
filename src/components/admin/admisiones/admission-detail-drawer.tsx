"use client";

import {
  addAdmissionNoteAction,
  scheduleInterviewAction,
  updateAdmissionStatusAction,
  verifyDocumentsAction,
} from "@/app/admin/actions/admissions";
import {
  AdmissionPriorityBadge,
  AdmissionStatusBadge,
} from "@/components/admin/admisiones/admission-status-badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import {
  ADMISSION_STATUS_LABELS,
  DOCUMENT_TYPE_LABELS,
  QUICK_ACTIONS,
  type AdmissionStatus,
} from "@/lib/admissions/admin/constants";
import type { AdmissionDetail } from "@/lib/admissions/admin/types";
import { formatDateTime } from "@/lib/utils/date";
import { AnimatePresence, motion } from "framer-motion";
import { Download, FileText, X, ZoomIn } from "lucide-react";
import Image from "next/image";
import { useEffect, useState, useTransition } from "react";

interface AdmissionDetailDrawerProps {
  admissionId: string | null;
  onClose: () => void;
}

function DetailSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-[#083148]/10 bg-[#f7f9fc] p-4">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#083148]/55">
        {title}
      </h3>
      <dl className="grid gap-3 sm:grid-cols-2">{children}</dl>
    </section>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium text-[#083148]/50">{label}</dt>
      <dd className="mt-1 text-sm font-medium text-[#083148]">{value || "—"}</dd>
    </div>
  );
}

export function AdmissionDetailDrawer({ admissionId, onClose }: AdmissionDetailDrawerProps) {
  const [detail, setDetail] = useState<AdmissionDetail | null>(null);
  const [note, setNote] = useState("");
  const [interviewDate, setInterviewDate] = useState("");
  const [interviewNotes, setInterviewNotes] = useState("");
  const [sendNotification, setSendNotification] = useState(true);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  useEffect(() => {
    if (!admissionId) {
      setDetail(null);
      return;
    }

    setIsLoading(true);
    fetch(`/api/admin/admissions/${admissionId}`)
      .then((res) => res.json())
      .then((payload) => setDetail(payload.data ?? null))
      .finally(() => setIsLoading(false));
  }, [admissionId]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  async function refreshDetail() {
    if (!admissionId) return;
    const res = await fetch(`/api/admin/admissions/${admissionId}`);
    const payload = await res.json();
    setDetail(payload.data ?? null);
  }

  function runAction(
    action: () => Promise<{
      error?: string;
      success?: boolean;
      notificationMessage?: string;
    }>,
  ) {
    startTransition(async () => {
      const result = await action();
      if (result.error) {
        toast({ title: "Error", description: result.error, variant: "error" });
        return;
      }
      if (result.notificationMessage) {
        toast({
          title: "Entrevista agendada",
          description: result.notificationMessage,
          variant: result.notificationMessage.includes("no configurada") ? "default" : "success",
        });
      }
      await refreshDetail();
    });
  }

  return (
    <AnimatePresence>
      {admissionId && (
        <>
          <motion.button
            type="button"
            aria-label="Cerrar panel"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-[#06121a]/50 backdrop-blur-sm"
          />

          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-3xl flex-col border-l border-[#083148]/10 bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-[#083148]/10 px-5 py-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-[#083148]/45">Solicitud</p>
                <h2 className="text-lg font-bold text-[#083148]">
                  {detail?.studentName ?? "Cargando..."}
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-[#083148]/10 p-2 text-[#083148]/60 transition hover:bg-[#f7f9fc]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              {isLoading || !detail ? (
                <div className="space-y-4 animate-pulse">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-24 rounded-2xl bg-[#083148]/8" />
                  ))}
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <AdmissionStatusBadge status={detail.status} />
                    <AdmissionPriorityBadge priority={detail.priority} />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {QUICK_ACTIONS.map((action) => (
                      <Button
                        key={action.id}
                        type="button"
                        size="sm"
                        variant={action.id === "reject" ? "destructive" : "outline"}
                        disabled={isPending}
                        onClick={() =>
                          runAction(() =>
                            updateAdmissionStatusAction(detail.id, action.targetStatus),
                          )
                        }
                      >
                        {action.label}
                      </Button>
                    ))}
                    <Button
                      type="button"
                      size="sm"
                      disabled={isPending}
                      onClick={() => runAction(() => verifyDocumentsAction(detail.id))}
                    >
                      Verificar docs
                    </Button>
                  </div>

                  <DetailSection title="Datos del Estudiante">
                    <DetailItem label="Nombre" value={detail.student.firstName} />
                    <DetailItem label="Apellido" value={detail.student.lastName} />
                    <DetailItem label="Cédula" value={detail.student.nationalId} />
                    <DetailItem label="Fecha de nacimiento" value={detail.student.birthDate} />
                    <DetailItem label="Teléfono" value={detail.student.phone} />
                    <DetailItem label="Dirección" value={detail.student.address} />
                  </DetailSection>

                  <DetailSection title="Datos Académicos">
                    <DetailItem label="Grado solicitado" value={detail.academic.grade} />
                    <DetailItem label="Turno" value={detail.academic.shift} />
                    <DetailItem
                      label="Escuela de procedencia"
                      value={
                        detail.academic.sameSchool
                          ? "Mismo colegio"
                          : detail.academic.previousSchool ?? "—"
                      }
                    />
                    <DetailItem label="Promedio" value={detail.academic.previousAverage ?? "—"} />
                    <DetailItem
                      label="Repitió grado"
                      value={detail.academic.repeatedGrade === "yes" ? "Sí" : "No"}
                    />
                  </DetailSection>

                  <DetailSection title="Datos del Representante">
                    <DetailItem label="Relación" value={detail.tutor.relationship} />
                    <DetailItem label="Nombre" value={`${detail.tutor.firstName} ${detail.tutor.lastName}`} />
                    <DetailItem label="Teléfono" value={detail.tutor.phone} />
                    <DetailItem label="Correo" value={detail.tutor.email} />
                    <DetailItem label="Ocupación" value={detail.tutor.occupation} />
                    <DetailItem label="Dirección" value={detail.tutor.address} />
                  </DetailSection>

                  <section className="rounded-2xl border border-[#083148]/10 bg-white p-4">
                    <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-[#083148]/55">
                      Documentos
                    </h3>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {Object.entries(detail.documents).map(([key, doc]) => {
                        if (!doc) return null;
                        const isImage = doc.mimeType.startsWith("image/");
                        return (
                          <div key={key} className="rounded-xl border border-[#083148]/10 p-3">
                            <p className="text-sm font-semibold text-[#083148]">
                              {DOCUMENT_TYPE_LABELS[key] ?? key}
                            </p>
                            <p className="mt-1 truncate text-xs text-[#083148]/50">{doc.fileName}</p>
                            <div className="mt-3 flex gap-2">
                              <button
                                type="button"
                                onClick={() => setPreviewUrl(doc.url)}
                                className="inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-semibold text-[#083148]"
                              >
                                <ZoomIn className="h-3.5 w-3.5" />
                                Ver
                              </button>
                              <a
                                href={doc.url}
                                download
                                className="inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-semibold text-[#083148]"
                              >
                                <Download className="h-3.5 w-3.5" />
                                Descargar
                              </a>
                            </div>
                            {isImage && (
                              <div className="relative mt-3 h-28 overflow-hidden rounded-lg bg-[#f7f9fc]">
                                <Image src={doc.url} alt={doc.fileName} fill className="object-cover" unoptimized />
                              </div>
                            )}
                            {!isImage && (
                              <div className="mt-3 flex h-28 items-center justify-center rounded-lg bg-[#f7f9fc]">
                                <FileText className="h-8 w-8 text-[#083148]/35" />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </section>

                  <section className="rounded-2xl border border-[#083148]/10 bg-white p-4">
                    <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-[#083148]/55">
                      Agendar entrevista
                    </h3>
                    <div className="space-y-3">
                      <input
                        type="datetime-local"
                        value={interviewDate}
                        onChange={(e) => setInterviewDate(e.target.value)}
                        className="h-10 w-full rounded-xl border border-[#083148]/10 px-3 text-sm"
                      />
                      <textarea
                        value={interviewNotes}
                        onChange={(e) => setInterviewNotes(e.target.value)}
                        rows={2}
                        placeholder="Observaciones para la entrevista..."
                        className="w-full rounded-xl border border-[#083148]/10 px-3 py-2 text-sm outline-none"
                      />
                      <label className="flex items-center gap-2 text-sm text-[#083148]/75">
                        <input
                          type="checkbox"
                          checked={sendNotification}
                          onChange={(e) => setSendNotification(e.target.checked)}
                          className="h-4 w-4 rounded border-[#083148]/20"
                        />
                        Enviar notificación por correo al representante
                      </label>
                      <Button
                        type="button"
                        disabled={!interviewDate || isPending}
                        onClick={() =>
                          runAction(() =>
                            scheduleInterviewAction({
                              admissionId: detail.id,
                              scheduledAt: new Date(interviewDate).toISOString(),
                              notes: interviewNotes || undefined,
                              sendNotification,
                            }),
                          )
                        }
                      >
                        Agendar entrevista
                      </Button>
                    </div>
                  </section>

                  <section className="rounded-2xl border border-[#083148]/10 bg-white p-4">
                    <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-[#083148]/55">
                      Seguimiento
                    </h3>
                    <div className="space-y-3">
                      {[...detail.history, ...detail.activity].slice(0, 8).map((item) => (
                        <div key={item.id} className="rounded-xl bg-[#f7f9fc] px-3 py-2">
                          <p className="text-sm font-medium text-[#083148]">
                            {"title" in item
                              ? item.title
                              : `Estado: ${ADMISSION_STATUS_LABELS[item.to_status as AdmissionStatus]}`}
                          </p>
                          <p className="text-xs text-[#083148]/45">{formatDateTime(item.created_at)}</p>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="rounded-2xl border border-[#083148]/10 bg-white p-4">
                    <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-[#083148]/55">
                      Notas internas
                    </h3>
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      rows={3}
                      placeholder="Agregar comentario privado..."
                      className="w-full rounded-xl border border-[#083148]/10 px-3 py-2 text-sm outline-none focus:border-[#5B3E8C]/40"
                    />
                    <Button
                      type="button"
                      className="mt-3"
                      size="sm"
                      disabled={!note.trim() || isPending}
                      onClick={() =>
                        runAction(async () => {
                          const result = await addAdmissionNoteAction(detail.id, note);
                          if (!result.error) setNote("");
                          return result;
                        })
                      }
                    >
                      Guardar nota
                    </Button>
                    <div className="mt-4 space-y-2">
                      {detail.notes.map((item) => (
                        <div key={item.id} className="rounded-xl bg-[#f7f9fc] px-3 py-2">
                          <p className="text-sm text-[#083148]">{item.content}</p>
                          <p className="mt-1 text-xs text-[#083148]/45">
                            {item.author_name} · {formatDateTime(item.created_at)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              )}
            </div>
          </motion.aside>

          {previewUrl && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-6">
              <button
                type="button"
                onClick={() => setPreviewUrl(null)}
                className="absolute right-6 top-6 rounded-full bg-white/10 p-2 text-white"
              >
                <X className="h-5 w-5" />
              </button>
              {previewUrl.endsWith(".pdf") || previewUrl.includes("application/pdf") ? (
                <iframe src={previewUrl} className="h-[80vh] w-full max-w-4xl rounded-xl bg-white" title="PDF" />
              ) : (
                <div className="relative h-[80vh] w-full max-w-3xl">
                  <Image src={previewUrl} alt="Vista previa" fill className="object-contain" unoptimized />
                </div>
              )}
            </div>
          )}
        </>
      )}
    </AnimatePresence>
  );
}
