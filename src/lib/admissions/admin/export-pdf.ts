import type { AdmissionExportRow } from "@/lib/admissions/admin/export-data";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

interface ExportSummary {
  total: number;
  aprobados: number;
  rechazados: number;
  tasaAprobacion: number;
  generadoEl: string;
}

export function buildAdmissionsPdfBuffer(rows: AdmissionExportRow[], summary: ExportSummary) {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

  doc.setFillColor(8, 49, 72);
  doc.rect(0, 0, 297, 28, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.text("Reporte de Admisiones — Complejo Educativo Dr. Cristóbal Mendoza", 14, 12);
  doc.setFontSize(10);
  doc.text(`Generado el ${summary.generadoEl}`, 14, 20);

  doc.setTextColor(8, 49, 72);
  doc.setFontSize(11);
  doc.text(`Total solicitudes: ${summary.total}`, 14, 38);
  doc.text(`Aprobados/Inscritos: ${summary.aprobados}`, 90, 38);
  doc.text(`Rechazados: ${summary.rechazados}`, 170, 38);
  doc.text(`Tasa de aprobación: ${summary.tasaAprobacion}%`, 230, 38);

  autoTable(doc, {
    startY: 46,
    head: [
      [
        "Estudiante",
        "Grado",
        "Turno",
        "Representante",
        "Estado",
        "Fecha",
        "Procedencia",
      ],
    ],
    body: rows.map((row) => [
      row.estudiante,
      row.grado,
      row.turno,
      row.representante,
      row.estado,
      row.fechaSolicitud,
      row.escuelaProcedencia,
    ]),
    styles: {
      fontSize: 8,
      cellPadding: 2,
      textColor: [8, 49, 72],
    },
    headStyles: {
      fillColor: [91, 62, 140],
      textColor: 255,
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [247, 249, 252],
    },
    margin: { left: 14, right: 14 },
  });

  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text(`Página ${i} de ${pageCount}`, 270, 200, { align: "right" });
  }

  return Buffer.from(doc.output("arraybuffer"));
}
