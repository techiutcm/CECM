export interface StageStat {
  id: string;
  label: string;
  icon: "stem" | "projects" | "integral";
  startValue: number;
  endValue: number;
  prefix?: string;
  suffix?: string;
  padLength?: number;
  duration?: number;
}

export const stageStats: StageStat[] = [
  {
    id: "stem",
    startValue: 1,
    endValue: 4,
    prefix: "+",
    padLength: 2,
    label: "Áreas STEM integradas",
    icon: "stem",
    duration: 1800,
  },
  {
    id: "projects",
    startValue: 1,
    endValue: 10,
    prefix: "+",
    padLength: 2,
    label: "Proyectos reales por año",
    icon: "projects",
    duration: 2000,
  },
  {
    id: "integral",
    startValue: 1,
    endValue: 100,
    suffix: "%",
    padLength: 2,
    label: "Formación integral",
    icon: "integral",
    duration: 2400,
  },
];
