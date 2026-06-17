import { AdmissionWizard } from "@/components/admissions/admission-wizard";
import { SiteNavbar } from "@/components/site/site-navbar";
import { SiteFooter } from "@/components/site/site-footer";
import { ToastProvider } from "@/components/ui/toast";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admisiones",
  description:
    "Inscripción online del Complejo Educativo Dr. Cristóbal Mendoza. Completa tu solicitud en minutos.",
};

export default function AdmisionesPage() {
  return (
    <ToastProvider>
      <div className="relative min-h-screen overflow-hidden bg-[#eef2f6] dark:bg-[#06121a]">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(8,49,72,0.08),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(249,178,20,0.12),transparent_38%)]"
          aria-hidden
        />

        <SiteNavbar scrollProgress={1} />

        <main className="relative z-10 px-4 pb-16 pt-28 sm:px-6 lg:px-8">
          <div className="mx-auto mb-10 max-w-[900px] rounded-3xl border border-[#083148]/10 bg-[#083148] px-6 py-8 text-center shadow-xl shadow-[#083148]/20 sm:px-10 sm:py-10">
            <p className="font-montserrat text-xs font-bold uppercase tracking-[0.25em] text-[#F9B214]">
              Admisión 2025
            </p>
            <h1 className="font-bebas mt-3 text-4xl uppercase tracking-wide text-[#F9B214] sm:text-5xl">
              Solicitud de Inscripción
            </h1>
            <p className="font-montserrat mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-white/90 sm:text-base">
              Completa el formulario paso a paso. Tu progreso se guarda automáticamente para que
              puedas retomarlo cuando quieras.
            </p>
          </div>

          <AdmissionWizard />
        </main>

        <SiteFooter />
      </div>
    </ToastProvider>
  );
}
