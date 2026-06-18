import { SiteContainer } from "@/components/site/site-container";
import {
  getContentRevealMotion,
  getHeroBackgroundMotion,
  getTextRevealMotion,
} from "@/hooks/use-section-scroll-reveal";
import Link from "next/link";

const HERO_VIDEO_URL =
  "https://import.cdn.thinkific.com/371124%2Fcustom_site_themes%2Fid%2FK4cQEA03SeS9BWcQCUDg_video540p-230818-102825.gif";

const WHATSAPP_NUMBER = "584146046735";
const WHATSAPP_MESSAGE =
  "hola vengo de la pagina web y estoy interesado en saber mas";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

interface HeroSectionProps {
  scrollProgress: number;
  isMobile: boolean;
}

export function HeroSection({ scrollProgress, isMobile }: HeroSectionProps) {
  const backgroundMotion = getHeroBackgroundMotion(scrollProgress);
  const textMotion = getTextRevealMotion(scrollProgress, isMobile);
  const ctaMotion = getContentRevealMotion(scrollProgress, isMobile);

  return (
    <section className="relative flex min-h-[88vh] items-center overflow-hidden sm:min-h-[92vh]">
      <div
        className="absolute inset-0 will-change-transform"
        style={{
          transform: backgroundMotion.transform,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={HERO_VIDEO_URL}
          alt=""
          aria-hidden
          className="h-full w-full scale-105 object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(8,49,72,0.38) 45%, rgba(249,178,20,0.32) 100%)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white/25 via-transparent to-white/10" />
      </div>

      <div className="relative z-10 w-full pb-16 pt-36 sm:pb-16 lg:pt-40">
        <SiteContainer>
          <div className="max-w-3xl">
            <div
              className="will-change-transform"
              style={{
                transform: textMotion.transform,
                opacity: textMotion.opacity,
              }}
            >
              <p className="font-montserrat mb-5 text-xs font-bold uppercase tracking-[0.25em] text-[#F9B214]">
                El futuro no se espera, se construye hoy.
              </p>

              <h1 className="font-bebas text-4xl leading-[0.95] tracking-wide text-white drop-shadow-[0_2px_12px_rgba(8,49,72,0.85)] sm:text-5xl md:text-6xl lg:text-[4.25rem]">
                Complejo Educativo
                <br />
                Dr. Cristóbal Mendoza.
              </h1>
            </div>

            <div
              className="mt-10 flex flex-col gap-4 will-change-transform sm:flex-row sm:items-center"
              style={{
                transform: ctaMotion.transform,
                opacity: ctaMotion.opacity,
              }}
            >
              <Link
                href="/admisiones"
                className="font-montserrat inline-flex items-center justify-center rounded-full bg-[#083148] px-8 py-3.5 text-sm font-bold uppercase tracking-wide text-white shadow-lg transition hover:bg-[#0a4466]"
              >
                Asegura el cupo de tu hijo
              </Link>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-montserrat inline-flex items-center justify-center gap-2.5 rounded-full bg-[#F9B214] px-8 py-3.5 text-sm font-bold uppercase tracking-wide text-[#083148] shadow-lg transition hover:bg-[#e5a012]"
              >
                <WhatsAppIcon className="h-5 w-5 shrink-0" />
                Ir a Whatsapp
              </a>
            </div>
          </div>
        </SiteContainer>
      </div>
    </section>
  );
}
