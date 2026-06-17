"use client";

import { StagesBackground } from "@/components/site/stages-background";
import Image from "next/image";
import Link from "next/link";

export function LoginAsidePanel() {
  return (
    <aside className="relative hidden min-h-screen w-1/2 overflow-hidden lg:block">
      <StagesBackground static />

      <div className="relative z-10 flex min-h-screen flex-col justify-between p-12 xl:p-14">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 backdrop-blur-sm transition hover:bg-white/10"
          >
            <Image
              src="/logo-navbar.png"
              alt="Complejo Educativo Dr. Cristóbal Mendoza"
              width={44}
              height={44}
              className="h-11 w-11 object-contain"
            />
            <span className="font-montserrat text-sm font-semibold uppercase tracking-wide text-white/90">
              Volver al sitio
            </span>
          </Link>
        </div>

        <div className="max-w-xl">
          <span className="font-montserrat inline-flex items-center rounded-full border border-[#F9B214]/30 bg-[#F9B214]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-[#F9B214] xl:text-sm">
            Acceso administrativo
          </span>
        </div>

        <div className="grid max-w-xl grid-cols-3 gap-5 border-t border-white/10 pt-8">
          <div>
            <p className="font-bebas text-3xl uppercase tracking-wide text-[#F9B214] xl:text-4xl">
              Blog
            </p>
            <p className="font-montserrat mt-1.5 text-sm leading-snug text-white/70">
              Publicaciones y media
            </p>
          </div>
          <div>
            <p className="font-bebas text-3xl uppercase tracking-wide text-[#F9B214] xl:text-4xl">
              Admisiones
            </p>
            <p className="font-montserrat mt-1.5 text-sm leading-snug text-white/70">
              CRM de inscripciones
            </p>
          </div>
          <div>
            <p className="font-bebas text-3xl uppercase tracking-wide text-[#F9B214] xl:text-4xl">
              Roles
            </p>
            <p className="font-montserrat mt-1.5 text-sm leading-snug text-white/70">
              Acceso seguro
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
