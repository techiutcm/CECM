import { AnimatedStatCounter } from "@/components/site/animated-stat-counter";
import type { StageStat } from "@/lib/site/stats";
import { stageStats } from "@/lib/site/stats";

function StatIcon({ type }: { type: StageStat["icon"] }) {
  const className = "h-7 w-7 shrink-0 text-[#083148] sm:h-8 sm:w-8";

  if (type === "stem") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
        <circle cx="6" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.75" />
        <circle cx="18" cy="6" r="2.5" stroke="currentColor" strokeWidth="1.75" />
        <circle cx="18" cy="18" r="2.5" stroke="currentColor" strokeWidth="1.75" />
        <path
          d="M8.2 11.2L15.5 7.2M8.2 12.8L15.5 16.8"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (type === "projects") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M10 4.5h4l1 2.5h3.5a1 1 0 011 1V18a1.5 1.5 0 01-1.5 1.5h-11A1.5 1.5 0 015 18V8a1 1 0 011-1H9l1-2.5z"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinejoin="round"
        />
        <path
          d="M9.5 14.5c.8-1.2 1.7-1.8 2.5-1.8s1.7.6 2.5 1.8"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
        <circle cx="10" cy="11" r="0.9" fill="currentColor" />
        <circle cx="14" cy="10" r="0.75" fill="currentColor" />
        <circle cx="16" cy="12.5" r="0.65" fill="currentColor" />
      </svg>
    );
  }

  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M8 8.5V7a2 2 0 012-2h4a2 2 0 012 2v1.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <rect
        x="5"
        y="8.5"
        width="14"
        height="11"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M8.5 14.5h7M8.5 16.5h4"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M15.5 13.5l1 1.25 2-2.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StatItem({ stat }: { stat: StageStat }) {
  return (
    <div className="flex flex-1 items-center gap-3 px-5 py-5 sm:gap-4 sm:px-6 sm:py-6">
      <StatIcon type={stat.icon} />
      <div className="min-w-0">
        <AnimatedStatCounter
          startValue={stat.startValue}
          endValue={stat.endValue}
          prefix={stat.prefix}
          suffix={stat.suffix}
          padLength={stat.padLength}
          duration={stat.duration}
          className="font-montserrat text-2xl font-bold leading-none text-[#083148] sm:text-[1.75rem]"
          ariaLabel={`${stat.endValue}${stat.suffix ?? ""} ${stat.label}`}
        />
        <p className="font-montserrat mt-1.5 text-sm leading-snug text-[#5c6b7a] sm:text-[0.9375rem]">
          {stat.label}
        </p>
      </div>
    </div>
  );
}

export function StagesStats() {
  return (
    <div className="mt-10 grid grid-cols-1 gap-4 pb-2 sm:grid-cols-3 sm:gap-5 sm:pb-0">
      {stageStats.map((stat) => (
        <div
          key={stat.id}
          className="min-w-0 overflow-hidden rounded-2xl bg-white shadow-lg shadow-black/10"
        >
          <StatItem stat={stat} />
        </div>
      ))}
    </div>
  );
}
