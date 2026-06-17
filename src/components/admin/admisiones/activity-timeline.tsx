import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "@/lib/utils/date";

interface ActivityTimelineProps {
  items: {
    id: string;
    title: string;
    description?: string | null;
    created_at: string;
  }[];
}

export function ActivityTimeline({ items }: ActivityTimelineProps) {
  return (
    <div className="rounded-2xl border border-[#083148]/10 bg-white p-5 shadow-sm">
      <h3 className="font-semibold text-[#083148]">Actividad reciente</h3>
      <div className="mt-5 space-y-4">
        {items.length === 0 ? (
          <p className="text-sm text-[#083148]/50">Aún no hay actividad registrada.</p>
        ) : (
          items.map((item, index) => (
            <div key={item.id} className="relative flex gap-3 pl-4">
              <span
                className={cn(
                  "absolute left-0 top-1.5 h-2 w-2 rounded-full bg-[#5B3E8C]",
                  index < items.length - 1 && "before:absolute before:left-[3px] before:top-3 before:h-[calc(100%+12px)] before:w-px before:bg-[#083148]/10",
                )}
              />
              <div>
                <p className="text-sm font-medium text-[#083148]">{item.title}</p>
                {item.description && (
                  <p className="mt-1 text-sm text-[#083148]/60">{item.description}</p>
                )}
                <p className="mt-1 text-xs text-[#083148]/40">
                  {formatDistanceToNow(item.created_at)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
