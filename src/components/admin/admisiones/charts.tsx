"use client";

interface ChartBarProps {
  title: string;
  data: { label: string; count: number }[];
}

export function ChartBar({ title, data }: ChartBarProps) {
  const max = Math.max(...data.map((item) => item.count), 1);

  return (
    <div className="rounded-2xl border border-[#083148]/10 bg-white p-5 shadow-sm">
      <h3 className="font-semibold text-[#083148]">{title}</h3>
      <div className="mt-6 flex h-48 items-end gap-3">
        {data.length === 0 ? (
          <p className="text-sm text-[#083148]/50">Sin datos aún</p>
        ) : (
          data.map((item) => (
            <div key={item.label} className="flex flex-1 flex-col items-center gap-2">
              <div className="flex w-full flex-1 items-end">
                <div
                  className="w-full rounded-t-lg bg-gradient-to-t from-[#083148] to-[#5B3E8C] transition-all"
                  style={{ height: `${(item.count / max) * 100}%`, minHeight: item.count > 0 ? "8px" : "0" }}
                  title={`${item.count} solicitudes`}
                />
              </div>
              <span className="text-[10px] font-medium text-[#083148]/60">{item.label}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

interface DonutChartProps {
  title: string;
  data: { label: string; count: number }[];
}

const COLORS = ["#083148", "#5B3E8C", "#7C5CBF", "#3D8BFF", "#2BAE8E", "#F9B214", "#DB2B2C"];

export function DonutChart({ title, data }: DonutChartProps) {
  const total = data.reduce((sum, item) => sum + item.count, 0) || 1;
  let cumulative = 0;

  const segments = data.map((item, index) => {
    const start = (cumulative / total) * 360;
    cumulative += item.count;
    const end = (cumulative / total) * 360;
    return { ...item, start, end, color: COLORS[index % COLORS.length] };
  });

  const gradient = segments
    .map((segment) => `${segment.color} ${segment.start}deg ${segment.end}deg`)
    .join(", ");

  return (
    <div className="rounded-2xl border border-[#083148]/10 bg-white p-5 shadow-sm">
      <h3 className="font-semibold text-[#083148]">{title}</h3>
      <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div
          className="relative h-36 w-36 rounded-full"
          style={{ background: total > 0 ? `conic-gradient(${gradient})` : "#e8edf3" }}
        >
          <div className="absolute inset-5 flex items-center justify-center rounded-full bg-white text-center">
            <div>
              <p className="text-2xl font-bold text-[#083148]">{total}</p>
              <p className="text-[10px] text-[#083148]/50">Total</p>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          {data.map((item, index) => (
            <div key={item.label} className="flex items-center gap-2 text-sm">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="text-[#083148]/75">{item.label}</span>
              <span className="font-semibold text-[#083148]">{item.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface PieChartProps {
  title: string;
  data: { label: string; count: number }[];
}

export function PieChart({ title, data }: PieChartProps) {
  return <DonutChart title={title} data={data} />;
}
