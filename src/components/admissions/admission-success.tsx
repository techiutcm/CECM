"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

interface AdmissionSuccessProps {
  onViewSummary: () => void;
}

export function AdmissionSuccess({ onViewSummary }: AdmissionSuccessProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="mx-auto w-full max-w-[900px] rounded-3xl border border-white/60 bg-white/75 p-8 text-center shadow-2xl backdrop-blur-xl sm:p-12"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 220, damping: 18 }}
        className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100"
      >
        <CheckCircle2 className="h-10 w-10 text-emerald-600" />
      </motion.div>

      <h1 className="font-bebas mt-6 text-4xl uppercase tracking-wide text-[#083148] sm:text-5xl">
        ¡Solicitud recibida exitosamente!
      </h1>

      <p className="font-montserrat mx-auto mt-4 max-w-xl text-base leading-relaxed text-[#083148]/75">
        Hemos recibido la información del estudiante. Próximamente nuestro equipo de admisiones se
        pondrá en contacto para coordinar la visita y entrevista.
      </p>

      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Button type="button" variant="outline" onClick={onViewSummary}>
          Ver Resumen
        </Button>
        <Link
          href="/"
          className="inline-flex h-11 items-center justify-center rounded-xl bg-[#083148] px-5 font-montserrat text-sm font-semibold text-white shadow-md transition hover:bg-[#0a3d5c]"
        >
          Volver al Inicio
        </Link>
      </div>
    </motion.div>
  );
}
