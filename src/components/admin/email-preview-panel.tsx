"use client";

import { emailBrand } from "@/lib/email/brand";
import { cn } from "@/lib/utils";
import { Mail, Monitor, Smartphone } from "lucide-react";
import { useMemo, useState } from "react";

export interface EmailPreviewPanelProps {
  to: string;
  subject: string;
  html: string;
  from?: string;
  className?: string;
  title?: string;
}

type PreviewMode = "desktop" | "mobile";

export function EmailPreviewPanel({
  to,
  subject,
  html,
  from,
  className,
  title = "Vista previa del correo",
}: EmailPreviewPanelProps) {
  const [mode, setMode] = useState<PreviewMode>("desktop");
  const fromLabel = from ?? `Admisiones CECM <${emailBrand.contactEmail}>`;

  const iframeHeight = useMemo(() => {
    if (mode === "mobile") return 620;
    return 560;
  }, [mode]);

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-[#083148]/10 bg-white shadow-sm",
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#083148]/10 bg-[#f7f9fc] px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#083148] text-white">
            <Mail className="h-4 w-4" />
          </span>
          <div>
            <p className="text-sm font-semibold text-[#083148]">{title}</p>
            <p className="text-xs text-[#083148]/50">Maquetación institucional</p>
          </div>
        </div>

        <div className="flex rounded-lg border border-[#083148]/10 bg-white p-1">
          <button
            type="button"
            onClick={() => setMode("desktop")}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-semibold transition",
              mode === "desktop"
                ? "bg-[#083148] text-white"
                : "text-[#083148]/60 hover:text-[#083148]",
            )}
          >
            <Monitor className="h-3.5 w-3.5" />
            Escritorio
          </button>
          <button
            type="button"
            onClick={() => setMode("mobile")}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-semibold transition",
              mode === "mobile"
                ? "bg-[#083148] text-white"
                : "text-[#083148]/60 hover:text-[#083148]",
            )}
          >
            <Smartphone className="h-3.5 w-3.5" />
            Móvil
          </button>
        </div>
      </div>

      <div className="space-y-0 border-b border-[#083148]/10 bg-white px-4 py-3 text-sm">
        <div className="grid gap-2 sm:grid-cols-[72px_1fr]">
          <span className="text-xs font-semibold uppercase tracking-wide text-[#083148]/45">De</span>
          <span className="truncate font-medium text-[#083148]">{fromLabel}</span>
        </div>
        <div className="grid gap-2 sm:grid-cols-[72px_1fr]">
          <span className="text-xs font-semibold uppercase tracking-wide text-[#083148]/45">Para</span>
          <span className="truncate font-medium text-[#083148]">{to || "—"}</span>
        </div>
        <div className="grid gap-2 sm:grid-cols-[72px_1fr]">
          <span className="text-xs font-semibold uppercase tracking-wide text-[#083148]/45">Asunto</span>
          <span className="font-medium text-[#083148]">{subject}</span>
        </div>
      </div>

      <div
        className="overflow-auto bg-[#e8edf2] p-4"
        style={{ backgroundImage: `linear-gradient(180deg, ${emailBrand.colors.background} 0%, #e8edf2 100%)` }}
      >
        <div
          className={cn(
            "mx-auto overflow-hidden rounded-xl border border-[#083148]/10 bg-white shadow-lg transition-all",
            mode === "mobile" ? "w-[375px]" : "w-full max-w-[600px]",
          )}
        >
          <iframe
            title={subject}
            srcDoc={html}
            className="w-full border-0 bg-white"
            style={{ height: iframeHeight }}
            sandbox=""
          />
        </div>
      </div>
    </div>
  );
}
