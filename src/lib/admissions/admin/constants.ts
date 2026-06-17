export const ADMISSION_STATUSES = [
  "nueva",
  "documentos_pendientes",
  "documentos_verificados",
  "entrevista_agendada",
  "entrevista_realizada",
  "aprobado",
  "inscrito",
  "rechazado",
] as const;

export type AdmissionStatus = (typeof ADMISSION_STATUSES)[number];

export const ADMISSION_PRIORITIES = ["low", "normal", "high", "urgent"] as const;
export type AdmissionPriority = (typeof ADMISSION_PRIORITIES)[number];

export const ADMISSION_STATUS_LABELS: Record<AdmissionStatus, string> = {
  nueva: "Nueva Solicitud",
  documentos_pendientes: "Documentos Pendientes",
  documentos_verificados: "Documentos Verificados",
  entrevista_agendada: "Entrevista Agendada",
  entrevista_realizada: "Entrevista Realizada",
  aprobado: "Aprobado",
  inscrito: "Inscrito",
  rechazado: "Rechazado",
};

export const ADMISSION_PRIORITY_LABELS: Record<AdmissionPriority, string> = {
  low: "Baja",
  normal: "Normal",
  high: "Alta",
  urgent: "Urgente",
};

export const KANBAN_COLUMNS = [
  {
    id: "nueva",
    label: "Nueva",
    statuses: ["nueva", "documentos_pendientes"] as AdmissionStatus[],
  },
  {
    id: "verificacion",
    label: "Verificación",
    statuses: ["documentos_verificados"] as AdmissionStatus[],
  },
  {
    id: "entrevista",
    label: "Entrevista",
    statuses: ["entrevista_agendada", "entrevista_realizada"] as AdmissionStatus[],
  },
  {
    id: "aprobados",
    label: "Aprobados",
    statuses: ["aprobado"] as AdmissionStatus[],
  },
  {
    id: "inscritos",
    label: "Inscritos",
    statuses: ["inscrito"] as AdmissionStatus[],
  },
] as const;

export const KPI_STATUS_GROUPS = {
  nuevas: ["nueva", "documentos_pendientes"] as AdmissionStatus[],
  entrevistasPendientes: ["entrevista_agendada"] as AdmissionStatus[],
  admitidos: ["aprobado", "inscrito"] as AdmissionStatus[],
  enRevision: [
    "documentos_verificados",
    "entrevista_realizada",
  ] as AdmissionStatus[],
  rechazados: ["rechazado"] as AdmissionStatus[],
};

export const QUICK_ACTIONS = [
  {
    id: "verify_documents",
    label: "Verificar Documentos",
    targetStatus: "documentos_verificados" as AdmissionStatus,
  },
  {
    id: "schedule_interview",
    label: "Agendar Entrevista",
    targetStatus: "entrevista_agendada" as AdmissionStatus,
  },
  {
    id: "request_info",
    label: "Solicitar Información",
    targetStatus: "documentos_pendientes" as AdmissionStatus,
  },
  {
    id: "approve",
    label: "Aprobar",
    targetStatus: "aprobado" as AdmissionStatus,
  },
  {
    id: "reject",
    label: "Rechazar",
    targetStatus: "rechazado" as AdmissionStatus,
  },
  {
    id: "enroll",
    label: "Inscribir",
    targetStatus: "inscrito" as AdmissionStatus,
  },
] as const;

export const DOCUMENT_TYPE_LABELS: Record<string, string> = {
  birthCertificate: "Partida de Nacimiento",
  idPhoto: "Foto Tipo Carnet",
  representativeId: "Cédula del Representante",
};
