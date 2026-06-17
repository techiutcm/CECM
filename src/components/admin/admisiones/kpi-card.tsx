import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface KpiCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  trend?: string;
  accent?: "blue" | "purple" | "green" | "amber" | "red";
}

const accents = {
  blue: "from-[#083148]/10 to-white border-[#083148]/10 text-[#083148]",
  purple: "from-[#5B3E8C]/10 to-white border-[#5B3E8C]/15 text-[#5B3E8C]",
  green: "from-emerald-500/10 to-white border-emerald-200 text-emerald-700",
  amber: "from-amber-500/10 to-white border-amber-200 text-amber-700",
  red: "from-red-500/10 to-white border-red-200 text-red-700",
};

export function KpiCard({ label, value, icon: Icon, trend, accent = "blue" }: KpiCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border bg-gradient-to-br p-5 shadow-sm transition hover:shadow-md",
        accents[accent],
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium opacity-80">{label}</p>
          <p className="mt-2 text-3xl font-bold">{value}</p>
          {trend && <p className="mt-2 text-xs opacity-70">{trend}</p>}
        </div>
        <div className="rounded-xl bg-white/80 p-2.5 shadow-sm">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
