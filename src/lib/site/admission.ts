export interface AdmissionStep {
  id: string;
  number: number;
  title: string;
  icon: "document" | "calendar" | "chat" | "graduation";
  borderColor: string;
}

export const admissionContent = {
  label: "Proceso de Admisión",
  title: "Un proceso simple para un gran futuro.",
  steps: [
    {
      id: "info",
      number: 1,
      title: "Solicita información",
      icon: "document",
      borderColor: "#083148",
    },
    {
      id: "visit",
      number: 2,
      title: "Agenda una visita",
      icon: "calendar",
      borderColor: "#DB2B2C",
    },
    {
      id: "interview",
      number: 3,
      title: "Entrevista",
      icon: "chat",
      borderColor: "#F9B214",
    },
    {
      id: "enrollment",
      number: 4,
      title: "Inscripción",
      icon: "graduation",
      borderColor: "#083148",
    },
  ] satisfies AdmissionStep[],
  cta: {
    title: "¿Listo para comenzar?",
    description:
      "Inicia tu solicitud hoy mismo y da el primer paso hacia la excelencia académica.",
    buttonLabel: "Iniciar Proceso de Admisión",
    href: "/admisiones",
  },
};
