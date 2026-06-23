import Image from "next/image";

interface EcosystemDecorProps {
  scrollOpacity?: number;
}

function VrBoyFigure({ shadowClassName = "" }: { shadowClassName?: string }) {
  return (
    <>
      <div className="ecosystem-levitate ecosystem-levitate-a relative w-full">
        <Image
          src="/ecosystem/vr-boy.png"
          alt=""
          width={680}
          height={860}
          className="h-auto w-full mix-blend-screen"
          sizes="(max-width: 640px) 92vw, (max-width: 1024px) 82vw, 540px"
          priority={false}
        />
      </div>
      <div
        className={`ecosystem-shadow-pulse ecosystem-shadow-pulse-a -mt-3 h-5 w-[62%] rounded-[50%] bg-[#0A2533]/30 blur-[10px] sm:-mt-4 sm:h-6 lg:-mt-5 lg:h-7 lg:w-[58%] lg:blur-[12px] ${shadowClassName}`}
      />
    </>
  );
}

/** VR boy al final de la sección — solo móvil/tablet */
export function EcosystemVrBoyMobile({ scrollOpacity = 1 }: EcosystemDecorProps) {
  return (
    <div
      className="relative z-10 mt-8 flex justify-center px-4 pb-2 sm:mt-10 lg:hidden"
      aria-hidden
      style={{ opacity: scrollOpacity }}
    >
      <div className="flex w-[min(92vw,400px)] flex-col items-center sm:w-[min(82vw,440px)]">
        <VrBoyFigure shadowClassName="h-6 w-[64%] blur-[11px] sm:h-7" />
      </div>
    </div>
  );
}

/** Decoración absoluta — desktop; impresora también en tablet+ */
export function EcosystemDecor({ scrollOpacity = 1 }: EcosystemDecorProps) {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden
      style={{ opacity: scrollOpacity }}
    >
      {/* VR boy — inferior izquierda (solo desktop) */}
      <div className="absolute bottom-0 left-0 hidden w-[min(44vw,300px)] flex-col items-center lg:flex lg:w-[420px] xl:left-4 xl:w-[480px] 2xl:w-[540px]">
        <VrBoyFigure />
      </div>

      {/* Impresora 3D — superior derecha */}
      <div className="absolute right-0 top-2 flex w-[min(48vw,220px)] flex-col items-center sm:top-4 sm:w-[min(40vw,280px)] lg:top-4 lg:w-[500px] xl:right-0 xl:w-[560px] 2xl:w-[620px]">
        <div className="ecosystem-levitate ecosystem-levitate-b relative w-full">
          <Image
            src="/ecosystem/3d-printer.png"
            alt=""
            width={720}
            height={620}
            className="h-auto w-full mix-blend-screen"
            sizes="(max-width: 640px) 48vw, (max-width: 1024px) 40vw, (max-width: 1536px) 500px, 620px"
            priority={false}
          />
        </div>
        <div className="ecosystem-shadow-pulse ecosystem-shadow-pulse-b -mt-2 h-4 w-[58%] rounded-[50%] bg-[#0A2533]/28 blur-[9px] sm:-mt-3 sm:h-5 lg:-mt-5 lg:h-7 lg:w-[52%] lg:blur-[13px] xl:h-8" />
      </div>
    </div>
  );
}
