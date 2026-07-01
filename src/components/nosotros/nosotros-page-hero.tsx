import { SiteContainer } from "@/components/site/site-container";
import Image from "next/image";

interface NosotrosPageHeroProps {
  eyebrow: string;
  title: string;
  description: string;
  imageSrc?: string;
  imageClassName?: string;
}

export function NosotrosPageHero({
  eyebrow,
  title,
  description,
  imageSrc = "/transformation-section-bg.jpg",
  imageClassName = "object-cover object-center",
}: NosotrosPageHeroProps) {
  return (
    <section className="relative min-h-[22rem] overflow-hidden sm:min-h-[26rem]">
      <div className="absolute inset-0">
        <Image
          src={imageSrc}
          alt=""
          fill
          priority
          sizes="100vw"
          className={imageClassName}
          aria-hidden
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(105deg, #071525 0%, #0c1f3d 40%, rgba(8,49,72,0.85) 100%)",
          }}
        />
      </div>

      <SiteContainer className="relative z-10 flex min-h-[inherit] items-end pb-12 pt-32 sm:pb-16 sm:pt-36">
        <div className="max-w-3xl">
          <p className="font-montserrat text-xs font-bold uppercase tracking-[0.25em] text-[#F9B214]">
            {eyebrow}
          </p>
          <h1 className="font-bebas mt-4 text-4xl uppercase leading-[0.95] tracking-wide text-white sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="font-montserrat mt-5 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
            {description}
          </p>
        </div>
      </SiteContainer>
    </section>
  );
}
