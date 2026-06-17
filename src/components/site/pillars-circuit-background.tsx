"use client";

import { useEffect, useRef } from "react";

interface Point {
  x: number;
  y: number;
}

interface CircuitPath {
  points: Point[];
  speed: number;
  pulseLength: number;
  progress: number;
  showStartNode: boolean;
  showEndNode: boolean;
  baseOpacity: number;
}

type Segment =
  | { kind: "h"; length: number }
  | { kind: "d"; length: number; up: boolean };

const pathBlueprints: Array<{
  yRatio: number;
  xStartRatio: number;
  segments: Segment[];
  speed: number;
  pulseLength: number;
  showStartNode: boolean;
  showEndNode: boolean;
  baseOpacity: number;
}> = [
  {
    yRatio: 0.12,
    xStartRatio: 0.02,
    segments: [
      { kind: "h", length: 0.22 },
      { kind: "d", length: 0.04, up: true },
      { kind: "h", length: 0.35 },
      { kind: "d", length: 0.03, up: false },
      { kind: "h", length: 0.18 },
    ],
    speed: 0.08,
    pulseLength: 0.12,
    showStartNode: true,
    showEndNode: true,
    baseOpacity: 0.22,
  },
  {
    yRatio: 0.2,
    xStartRatio: 0.08,
    segments: [
      { kind: "h", length: 0.14 },
      { kind: "d", length: 0.05, up: false },
      { kind: "h", length: 0.28 },
      { kind: "d", length: 0.04, up: true },
      { kind: "h", length: 0.3 },
    ],
    speed: 0.1,
    pulseLength: 0.1,
    showStartNode: false,
    showEndNode: true,
    baseOpacity: 0.18,
  },
  {
    yRatio: 0.28,
    xStartRatio: 0,
    segments: [
      { kind: "h", length: 0.38 },
      { kind: "d", length: 0.04, up: true },
      { kind: "h", length: 0.42 },
    ],
    speed: 0.07,
    pulseLength: 0.14,
    showStartNode: true,
    showEndNode: false,
    baseOpacity: 0.25,
  },
  {
    yRatio: 0.36,
    xStartRatio: 0.12,
    segments: [
      { kind: "h", length: 0.18 },
      { kind: "d", length: 0.03, up: false },
      { kind: "h", length: 0.2 },
      { kind: "d", length: 0.05, up: true },
      { kind: "h", length: 0.22 },
    ],
    speed: 0.11,
    pulseLength: 0.09,
    showStartNode: true,
    showEndNode: true,
    baseOpacity: 0.16,
  },
  {
    yRatio: 0.44,
    xStartRatio: 0.04,
    segments: [
      { kind: "h", length: 0.5 },
      { kind: "d", length: 0.04, up: false },
      { kind: "h", length: 0.28 },
    ],
    speed: 0.09,
    pulseLength: 0.13,
    showStartNode: false,
    showEndNode: true,
    baseOpacity: 0.2,
  },
  {
    yRatio: 0.52,
    xStartRatio: 0.18,
    segments: [
      { kind: "h", length: 0.12 },
      { kind: "d", length: 0.04, up: true },
      { kind: "h", length: 0.16 },
      { kind: "d", length: 0.03, up: false },
      { kind: "h", length: 0.34 },
    ],
    speed: 0.12,
    pulseLength: 0.08,
    showStartNode: true,
    showEndNode: false,
    baseOpacity: 0.17,
  },
  {
    yRatio: 0.6,
    xStartRatio: 0.06,
    segments: [
      { kind: "h", length: 0.32 },
      { kind: "d", length: 0.05, up: false },
      { kind: "h", length: 0.38 },
    ],
    speed: 0.085,
    pulseLength: 0.11,
    showStartNode: true,
    showEndNode: true,
    baseOpacity: 0.21,
  },
  {
    yRatio: 0.68,
    xStartRatio: 0.22,
    segments: [
      { kind: "h", length: 0.1 },
      { kind: "d", length: 0.04, up: true },
      { kind: "h", length: 0.24 },
      { kind: "d", length: 0.04, up: false },
      { kind: "h", length: 0.18 },
    ],
    speed: 0.095,
    pulseLength: 0.1,
    showStartNode: false,
    showEndNode: true,
    baseOpacity: 0.15,
  },
  {
    yRatio: 0.76,
    xStartRatio: 0.03,
    segments: [
      { kind: "h", length: 0.44 },
      { kind: "d", length: 0.04, up: true },
      { kind: "h", length: 0.2 },
      { kind: "d", length: 0.03, up: false },
      { kind: "h", length: 0.12 },
    ],
    speed: 0.075,
    pulseLength: 0.12,
    showStartNode: true,
    showEndNode: false,
    baseOpacity: 0.19,
  },
  {
    yRatio: 0.84,
    xStartRatio: 0.14,
    segments: [
      { kind: "h", length: 0.26 },
      { kind: "d", length: 0.05, up: false },
      { kind: "h", length: 0.3 },
    ],
    speed: 0.105,
    pulseLength: 0.09,
    showStartNode: true,
    showEndNode: true,
    baseOpacity: 0.14,
  },
  {
    yRatio: 0.92,
    xStartRatio: 0.05,
    segments: [
      { kind: "h", length: 0.2 },
      { kind: "d", length: 0.03, up: true },
      { kind: "h", length: 0.15 },
      { kind: "d", length: 0.04, up: false },
      { kind: "h", length: 0.38 },
    ],
    speed: 0.088,
    pulseLength: 0.11,
    showStartNode: false,
    showEndNode: true,
    baseOpacity: 0.18,
  },
];

function buildPath(
  width: number,
  height: number,
  blueprint: (typeof pathBlueprints)[number],
): Point[] {
  const points: Point[] = [];
  let x = width * blueprint.xStartRatio;
  let y = height * blueprint.yRatio;
  points.push({ x, y });

  for (const segment of blueprint.segments) {
    if (segment.kind === "h") {
      x += width * segment.length;
      points.push({ x, y });
      continue;
    }

    const offset = width * segment.length;
    x += offset;
    y += segment.up ? -offset : offset;
    points.push({ x, y });
  }

  return points;
}

function getTotalLength(points: Point[]): number {
  let total = 0;

  for (let i = 1; i < points.length; i++) {
    const dx = points[i].x - points[i - 1].x;
    const dy = points[i].y - points[i - 1].y;
    total += Math.hypot(dx, dy);
  }

  return total;
}

function getPointAtDistance(points: Point[], distance: number): Point {
  let remaining = distance;

  for (let i = 1; i < points.length; i++) {
    const from = points[i - 1];
    const to = points[i];
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const segLen = Math.hypot(dx, dy);

    if (remaining <= segLen) {
      const ratio = segLen === 0 ? 0 : remaining / segLen;
      return {
        x: from.x + dx * ratio,
        y: from.y + dy * ratio,
      };
    }

    remaining -= segLen;
  }

  return points[points.length - 1];
}

function samplePath(points: Point[], startT: number, endT: number): Point[] {
  const total = getTotalLength(points);
  const startDist = Math.max(0, Math.min(1, startT)) * total;
  const endDist = Math.max(0, Math.min(1, endT)) * total;

  if (endDist <= startDist) return [];

  const span = endDist - startDist;
  const steps = Math.max(4, Math.ceil(span / 10));
  const samples: Point[] = [];

  for (let i = 0; i <= steps; i++) {
    const distance = startDist + (span * i) / steps;
    samples.push(getPointAtDistance(points, distance));
  }

  return samples;
}

function drawPolyline(
  ctx: CanvasRenderingContext2D,
  points: Point[],
  strokeStyle: string,
  lineWidth: number,
  glow = false,
) {
  if (points.length < 2) return;

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);

  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }

  ctx.strokeStyle = strokeStyle;
  ctx.lineWidth = lineWidth;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  if (glow) {
    ctx.shadowColor = "rgba(34, 211, 238, 0.65)";
    ctx.shadowBlur = 10;
  }

  ctx.stroke();
  ctx.restore();
}

function drawNode(ctx: CanvasRenderingContext2D, point: Point, alpha: number) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(point.x, point.y, 3.5, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(8, 49, 72, ${alpha})`;
  ctx.fill();
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = `rgba(34, 211, 238, ${alpha * 0.8})`;
  ctx.stroke();
  ctx.restore();
}

function drawDotGrid(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const spacing = 28;

  for (let x = spacing; x < width; x += spacing) {
    for (let y = spacing; y < height; y += spacing) {
      const flicker =
        (Math.sin(x * 0.09 + y * 0.07) + Math.cos(x * 0.04 - y * 0.05)) * 0.5 + 0.5;
      const alpha = 0.04 + flicker * 0.08;

      ctx.beginPath();
      ctx.arc(x, y, 1.1, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(8, 49, 72, ${alpha})`;
      ctx.fill();
    }
  }
}

function createPaths(width: number, height: number): CircuitPath[] {
  return pathBlueprints.map((blueprint) => ({
    points: buildPath(width, height, blueprint),
    speed: blueprint.speed,
    pulseLength: blueprint.pulseLength,
    progress: Math.random(),
    showStartNode: blueprint.showStartNode,
    showEndNode: blueprint.showEndNode,
    baseOpacity: blueprint.baseOpacity,
  }));
}

interface PillarsCircuitBackgroundProps {
  scrollProgress?: number;
}

export function PillarsCircuitBackground({
  scrollProgress = 0,
}: PillarsCircuitBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId = 0;
    let paths: CircuitPath[] = [];
    let lastTime = 0;

    function resize() {
      const { width, height } = container!.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas!.width = Math.floor(width * dpr);
      canvas!.height = Math.floor(height * dpr);
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;

      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      paths = createPaths(width, height);
    }

    function render(time: number) {
      const { width, height } = container!.getBoundingClientRect();
      const delta = lastTime === 0 ? 0 : (time - lastTime) / 1000;
      lastTime = time;

      ctx!.clearRect(0, 0, width, height);
      drawDotGrid(ctx!, width, height);

      for (const path of paths) {
        path.progress = (path.progress + path.speed * delta) % 1;

        drawPolyline(
          ctx!,
          path.points,
          `rgba(8, 49, 72, ${path.baseOpacity})`,
          1.2,
        );

        const pulseStart = path.progress;
        const pulseEnd = Math.min(1, path.progress + path.pulseLength);
        const pulsePoints = samplePath(path.points, pulseStart, pulseEnd);

        if (pulsePoints.length >= 2) {
          drawPolyline(
            ctx!,
            pulsePoints,
            "rgba(34, 211, 238, 0.85)",
            2.4,
            true,
          );

          const head = pulsePoints[pulsePoints.length - 1];
          ctx!.save();
          ctx!.beginPath();
          ctx!.arc(head.x, head.y, 4, 0, Math.PI * 2);
          ctx!.fillStyle = "rgba(34, 211, 238, 0.95)";
          ctx!.shadowColor = "rgba(34, 211, 238, 0.8)";
          ctx!.shadowBlur = 14;
          ctx!.fill();
          ctx!.restore();
        }

        if (path.showStartNode) {
          drawNode(ctx!, path.points[0], 0.55);
        }

        if (path.showEndNode) {
          drawNode(ctx!, path.points[path.points.length - 1], 0.55);
        }
      }

      animationId = window.requestAnimationFrame(render);
    }

    resize();
    animationId = window.requestAnimationFrame(render);

    const observer = new ResizeObserver(resize);
    observer.observe(container);

    return () => {
      window.cancelAnimationFrame(animationId);
      observer.disconnect();
    };
  }, []);

  const backgroundOffset = scrollProgress * -70;

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden
    >
      <div
        className="absolute inset-0 will-change-transform"
        style={{
          transform: `translate3d(0, ${backgroundOffset}px, 0) scale(1.04)`,
        }}
      >
        <canvas ref={canvasRef} className="h-full w-full" />
      </div>
    </div>
  );
}
