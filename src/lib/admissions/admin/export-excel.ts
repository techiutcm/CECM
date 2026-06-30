import type { AdmissionExportRow } from "@/lib/admissions/admin/export-data";
import * as XLSX from "xlsx";

const HEADERS = [
  "ID",
  "Estudiante",
  "Cédula",
  "Grado",
  "Turno",
  "Representante",
  "Teléfono",
  "Email",
  "Estado",
  "Fecha solicitud",
  "Procedencia",
  "Escuela procedencia",
  "Rendimiento académico",
  "Repitió grado",
] as const;

export function buildAdmissionsExcelBuffer(rows: AdmissionExportRow[]) {
  const sheetData: (string | number)[][] = [
    [...HEADERS],
    ...rows.map((row) => [
      row.id,
      row.estudiante,
      row.cedula,
      row.grado,
      row.turno,
      row.representante,
      row.telefonoRepresentante,
      row.emailRepresentante,
      row.estado,
      row.fechaSolicitud,
      row.procedencia,
      row.escuelaProcedencia,
      row.rendimientoAcademico,
      row.repitioGrado,
    ]),
  ];

  const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
  worksheet["!cols"] = [
    { wch: 36 },
    { wch: 28 },
    { wch: 14 },
    { wch: 14 },
    { wch: 10 },
    { wch: 28 },
    { wch: 16 },
    { wch: 28 },
    { wch: 22 },
    { wch: 20 },
    { wch: 22 },
    { wch: 24 },
    { wch: 10 },
    { wch: 12 },
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Solicitudes");

  return Buffer.from(XLSX.write(workbook, { type: "array", bookType: "xlsx" }));
}
