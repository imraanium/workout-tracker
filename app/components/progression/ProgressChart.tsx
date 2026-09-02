import { useEffect, useMemo, useRef, useState } from "react";

interface ChartPoint {
  date: string;
  value: number;
}

interface ProgressChartProps {
  points: ChartPoint[];
  unit: string;
  label: string;
  format: (value: number) => string;
  /** Lower values are better (e.g. running pace) — flips the vertical axis. */
  invert?: boolean;
}

const HEIGHT = 260;
const PAD = { top: 24, right: 16, bottom: 30, left: 44 };

export function ProgressChart({
  points,
  unit,
  label,
  format,
  invert = false,
}: ProgressChartProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(720);
  const [hovered, setHovered] = useState<number | null>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver((entries) => {
      const next = entries[0]?.contentRect.width;
      if (next) setWidth(next);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const geometry = useMemo(() => {
    const values = points.map((p) => p.value);
    const rawMin = Math.min(...values);
    const rawMax = Math.max(...values);
    const span = rawMax - rawMin || Math.max(rawMax * 0.1, 1);
    const min = rawMin - span * 0.35;
    const max = rawMax + span * 0.35;
    const innerW = Math.max(width - PAD.left - PAD.right, 40);
    const innerH = HEIGHT - PAD.top - PAD.bottom;

    const ratio = (value: number) => {
      const t = (value - min) / (max - min);
      return invert ? 1 - t : t;
    };

    const coords = points.map((p, i) => ({
      ...p,
      x:
        PAD.left +
        (points.length === 1 ? innerW / 2 : (i / (points.length - 1)) * innerW),
      y: PAD.top + innerH - ratio(p.value) * innerH,
    }));

    const line = coords
      .map(
        (c, i) => `${i === 0 ? "M" : "L"}${c.x.toFixed(2)},${c.y.toFixed(2)}`,
      )
      .join(" ");
    const area = `${line} L${coords[coords.length - 1].x.toFixed(2)},${PAD.top + innerH} L${coords[0].x.toFixed(
      2,
    )},${PAD.top + innerH} Z`;

    const ticks = [0, 0.5, 1].map((t) => ({
      y: PAD.top + innerH - t * innerH,
      value: min + (invert ? 1 - t : t) * (max - min),
    }));

    return { coords, line, area, ticks, innerH };
  }, [points, width, invert]);

  const active = hovered !== null ? geometry.coords[hovered] : null;

  return (
    <div ref={wrapRef} className="relative">
      <svg
        width={width}
        height={HEIGHT}
        role="img"
        aria-label={`${label} trend from ${points[0]?.date} to ${points[points.length - 1]?.date}`}
        className="block"
      >
        <defs>
          <linearGradient id="chart-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.32" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </linearGradient>
          <filter id="chart-glow" x="-20%" y="-40%" width="140%" height="180%">
            <feGaussianBlur stdDeviation="5" />
          </filter>
        </defs>

        {geometry.ticks.map((tick) => (
          <g key={tick.y}>
            <line
              x1={PAD.left}
              x2={width - PAD.right}
              y1={tick.y}
              y2={tick.y}
              stroke="#1E293B"
              strokeDasharray="3 5"
            />

            <text
              x={PAD.left - 10}
              y={tick.y + 4}
              textAnchor="end"
              className="fill-slate-600 text-[10px] font-semibold"
            >
              {format(tick.value)}
            </text>
          </g>
        ))}

        <path d={geometry.area} fill="url(#chart-fill)" />
        <path
          d={geometry.line}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.45"
          filter="url(#chart-glow)"
        />

        <path
          d={geometry.line}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {geometry.coords.map((c, i) => (
          <g key={c.date}>
            <text
              x={c.x}
              y={HEIGHT - 10}
              textAnchor="middle"
              className={`text-[10px] font-bold ${
                hovered === i ? "fill-slate-200" : "fill-slate-600"
              }`}
            >
              {c.date}
            </text>
            {hovered === i && (
              <line
                x1={c.x}
                x2={c.x}
                y1={PAD.top}
                y2={PAD.top + geometry.innerH}
                stroke="var(--accent-dim)"
              />
            )}
            <circle
              cx={c.x}
              cy={c.y}
              r={hovered === i ? 5.5 : 3}
              fill="#0F172A"
              stroke="var(--accent)"
              strokeWidth="2.5"
            />
          </g>
        ))}
      </svg>

      {active && (
        <div
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-lg border border-hairline bg-canvas px-2.5 py-1.5 shadow-panel"
          style={{ left: active.x, top: active.y - 12 }}
        >
          <p className="whitespace-nowrap text-xs font-extrabold tabular-nums text-white">
            {format(active.value)}{" "}
            <span className="font-semibold text-slate-500">{unit}</span>
          </p>
          <p className="text-[10px] font-semibold text-slate-500">
            {active.date}
          </p>
        </div>
      )}

      <div
        className="absolute inset-0 flex"
        style={{ paddingLeft: PAD.left - 8, paddingRight: PAD.right - 8 }}
      >
        {points.map((p, i) => (
          <div
            key={p.date}
            className="flex-1"
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            onFocus={() => setHovered(i)}
            onBlur={() => setHovered(null)}
            tabIndex={0}
            aria-label={`${p.date}: ${format(p.value)} ${unit}`}
            role="button"
          />
        ))}
      </div>
    </div>
  );
}
