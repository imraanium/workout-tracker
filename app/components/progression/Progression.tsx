import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { AwardIcon, LayersIcon, TargetIcon } from "lucide-react";
import { ProgressChart } from "./ProgressChart";
import { progressSeries, timeframes } from "../../data/progression";
import type { Timeframe } from "../../types/workout";
import { fetchProgression } from "../../actions";

function formatPace(value: number) {
  const minutes = Math.floor(value);
  const seconds = Math.round((value - minutes) * 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function Progression() {
  const [liveSeries, setLiveSeries] = useState(progressSeries);
  const [seriesId, setSeriesId] = useState(progressSeries[0].id);
  const [metricId, setMetricId] = useState<"primary" | "secondary">("primary");
  const [timeframe, setTimeframe] = useState<Timeframe>("1Y");
  useEffect(() => { void fetchProgression().then((series) => { if (series.length) { setLiveSeries(series); setSeriesId(series[0].id); } }); }, []);

  const series =
    liveSeries.find((s) => s.id === seriesId) ?? liveSeries[0];
  const metric =
    series.metrics.find((m) => m.id === metricId) ?? series.metrics[0];
  const isPace = metric.unit === "min/mi";

  const visible = useMemo(() => {
    const count =
      timeframes.find((t) => t.id === timeframe)?.points ??
      series.points.length;
    return series.points.slice(-count);
  }, [series, timeframe]);

  const chartPoints = visible.map((p) => ({
    date: p.date,
    value: p[metric.id],
  }));
  const totalSets = visible.reduce((sum, p) => sum + p.sets, 0);
  const first = chartPoints[0]?.value ?? 0;
  const last = chartPoints[chartPoints.length - 1]?.value ?? 0;
  const delta = last - first;
  const improved = metric.invert ? delta < 0 : delta > 0;
  const format = (value: number) =>
    isPace
      ? formatPace(value)
      : Number.isInteger(value)
        ? value.toLocaleString()
        : value.toFixed(1);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-white md:text-3xl">
          Progression
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Track how a single lift or run trends over time
        </p>
      </div>

      <section className="flex flex-col gap-3 rounded-xl border border-hairline bg-panel p-4 md:flex-row md:items-center">
        <label className="flex-1">
          <span className="sr-only">Exercise</span>
          <select
            value={seriesId}
            onChange={(e) => {
              setSeriesId(e.target.value);
              setMetricId("primary");
            }}
            className="w-full rounded-lg border border-hairline bg-zinc850 px-3 py-2.5 text-sm font-bold text-white outline-none transition-colors duration-150 ease-swift focus:border-accent"
          >
            {liveSeries.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </label>

        <div className="flex gap-1 rounded-lg border border-hairline bg-zinc850 p-1">
          {series.metrics.map((m) => (
            <button
              key={m.id}
              onClick={() => setMetricId(m.id)}
              aria-pressed={m.id === metricId}
              className={`rounded-md px-3 py-1.5 text-xs font-bold transition-colors duration-150 ease-swift ${
                m.id === metricId
                  ? "bg-slate-700 text-white"
                  : "text-slate-400 hover:text-slate-100"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        <div className="flex gap-1 rounded-lg border border-hairline bg-zinc850 p-1">
          {timeframes.map((t) => (
            <button
              key={t.id}
              onClick={() => setTimeframe(t.id)}
              aria-pressed={t.id === timeframe}
              className={`flex-1 rounded-md px-2.5 py-1.5 text-xs font-bold transition-colors duration-150 ease-swift ${
                t.id === timeframe
                  ? "bg-accent text-[color:var(--accent-ink)]"
                  : "text-slate-400 hover:text-slate-100"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-hairline bg-panel p-4 shadow-panel md:p-5">
        <div className="flex flex-wrap items-end justify-between gap-3 pb-2">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
              {series.name} · {metric.label}
            </p>
            <p className="mt-1 text-3xl font-extrabold tracking-tight tabular-nums text-white">
              {format(last)}{" "}
              <span className="text-base font-bold text-slate-500">
                {metric.unit}
              </span>
            </p>
          </div>
          <p
            className={`rounded-full px-2.5 py-1 text-xs font-bold tabular-nums ${
              improved
                ? "bg-accent-soft text-accent"
                : "bg-slate-800 text-slate-400"
            }`}
          >
            {delta > 0 ? "+" : ""}
            {isPace ? delta.toFixed(2) : format(Math.abs(delta))} over{" "}
            {timeframe}
          </p>
        </div>

        <ProgressChart
          points={chartPoints}
          unit={metric.unit}
          label={metric.label}
          format={format}
          invert={metric.invert}
        />
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        <Callout
          icon={<AwardIcon className="h-4 w-4 text-accent" strokeWidth={2.6} />}
          label="Personal Record"
          value={series.pr.value}
          caption={series.pr.caption}
          highlight
        />

        <Callout
          icon={
            <LayersIcon className="h-4 w-4 text-slate-400" strokeWidth={2.4} />
          }
          label="Total Sets Completed"
          value={totalSets.toLocaleString()}
          caption={`Across ${visible.length} logged periods`}
        />

        <Callout
          icon={
            <TargetIcon className="h-4 w-4 text-slate-400" strokeWidth={2.4} />
          }
          label={
            series.type === "running" ? "Projected Race Pace" : "Estimated 1RM"
          }
          value={series.oneRm}
          caption="Epley formula · last 3 sessions"
        />
      </section>
    </div>
  );
}

interface CalloutProps {
  icon: ReactNode;
  label: string;
  value: string;
  caption: string;
  highlight?: boolean;
}

function Callout({
  icon,
  label,
  value,
  caption,
  highlight = false,
}: CalloutProps) {
  return (
    <article
      className={`flex flex-col rounded-xl border bg-panel p-4 shadow-panel ${
        highlight ? "border-accent-soft" : "border-hairline"
      }`}
    >
      <div className="flex items-center gap-2">
        {icon}
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
          {label}
        </p>
      </div>
      <p
        className={`mt-2 text-2xl font-extrabold tracking-tight tabular-nums ${
          highlight ? "text-accent" : "text-white"
        }`}
      >
        {value}
      </p>
      <p className="mt-auto pt-1 text-xs text-slate-600">{caption}</p>
    </article>
  );
}
