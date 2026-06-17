"use client";

import { useToast } from "@/components/ui/toast";
import { Download, FileSpreadsheet, Loader2 } from "lucide-react";
import { useState } from "react";

async function downloadExport(url: string, fallbackName: string) {
  const response = await fetch(url);
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.error ?? "No se pudo generar el archivo");
  }

  const blob = await response.blob();
  const disposition = response.headers.get("Content-Disposition");
  const match = disposition?.match(/filename="(.+)"/);
  const filename = match?.[1] ?? fallbackName;

  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(objectUrl);
}

export function ExportActions() {
  const { toast } = useToast();
  const [loading, setLoading] = useState<"excel" | "pdf" | null>(null);

  async function handleExport(type: "excel" | "pdf") {
    setLoading(type);
    try {
      const url =
        type === "excel"
          ? "/api/admin/admissions/export/excel"
          : "/api/admin/admissions/export/pdf";
      await downloadExport(
        url,
        type === "excel" ? "admisiones.xlsx" : "reporte-admisiones.pdf",
      );
      toast({
        title: "Exportación lista",
        description:
          type === "excel"
            ? "El archivo Excel se descargó correctamente."
            : "El reporte PDF se descargó correctamente.",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Error al exportar",
        description: error instanceof Error ? error.message : "Intenta nuevamente.",
        variant: "error",
      });
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="flex flex-wrap gap-3">
      <button
        type="button"
        disabled={loading !== null}
        onClick={() => void handleExport("excel")}
        className="inline-flex items-center gap-2 rounded-xl border border-[#083148]/10 bg-white px-4 py-2.5 text-sm font-semibold text-[#083148] transition hover:bg-[#f7f9fc] disabled:opacity-60"
      >
        {loading === "excel" ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <FileSpreadsheet className="h-4 w-4" />
        )}
        Exportar Excel
      </button>
      <button
        type="button"
        disabled={loading !== null}
        onClick={() => void handleExport("pdf")}
        className="inline-flex items-center gap-2 rounded-xl border border-[#083148]/10 bg-white px-4 py-2.5 text-sm font-semibold text-[#083148] transition hover:bg-[#f7f9fc] disabled:opacity-60"
      >
        {loading === "pdf" ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Download className="h-4 w-4" />
        )}
        Exportar PDF
      </button>
    </div>
  );
}
