import { useEffect, useState } from "react";
import {
  CheckIcon,
  DumbbellIcon,
  FootprintsIcon,
  MoonIcon,
} from "lucide-react";
import { weeklyPlan } from "../data/weeklyPlan";
import type { PlanDay } from "../types/workout";
import { fetchWeeklyPlan } from "../actions";

function StatusBadge({ status }: { status: PlanDay["status"] }) {
  if (status === "completed") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-accent-soft px-2 py-0.5 text-[11px] font-bold text-accent">
        <CheckIcon className="h-3 w-3" strokeWidth={3.5} />
        Completed
      </span>
    );
  }
  if (status === "scheduled") {
    return (
      <span className="inline-flex items-center rounded-full border border-slate-700 px-2 py-0.5 text-[11px] font-bold text-slate-300">
        Scheduled
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-slate-800 px-2 py-0.5 text-[11px] font-bold text-slate-500">
      <MoonIcon className="h-3 w-3" />
      Rest Day
    </span>
  );
}

export function WeeklyPlan() {
  const [days, setDays] = useState(weeklyPlan);
  const [selectedId, setSelectedId] = useState(days[2].id);
  useEffect(() => { void fetchWeeklyPlan().then((value) => { if (value.length) { setDays(value); setSelectedId(value[0].id); } }); }, []);
  const selected =
    days.find((day) => day.id === selectedId) ?? days[0];
  const completed = days.filter((d) => d.status === "completed").length;
  const training = days.filter((d) => d.status !== "rest").length;

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white md:text-3xl">
            This Week
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Aug 31 – Sep 6 · recurring split
          </p>
        </div>
        <p className="shrink-0 text-sm font-bold tabular-nums text-slate-300">
          {completed}
          <span className="font-medium text-slate-600">
            /{training} sessions done
          </span>
        </p>
      </div>

      <div className="-mx-4 overflow-x-auto px-4 no-scrollbar md:mx-0 md:px-0">
        <ul className="flex min-w-max gap-2 md:grid md:min-w-0 md:grid-cols-7">
          {days.map((day) => {
            const isSelected = day.id === selectedId;
            const Icon =
              day.type === "running"
                ? FootprintsIcon
                : day.type
                  ? DumbbellIcon
                  : MoonIcon;
            return (
              <li key={day.id} className="w-[116px] md:w-auto">
                <button
                  onClick={() => setSelectedId(day.id)}
                  aria-pressed={isSelected}
                  className={`flex h-full w-full flex-col items-start gap-2 rounded-xl border p-3 text-left transition-[border-color,background-color] duration-150 ease-swift ${
                    isSelected
                      ? "border-accent bg-panel"
                      : "border-hairline bg-panel hover:border-slate-700"
                  }`}
                >
                  <div className="flex w-full items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      {day.weekday}
                    </span>
                    <span
                      className={`text-xs font-bold tabular-nums ${
                        isSelected ? "text-accent" : "text-slate-600"
                      }`}
                    >
                      {day.dayNumber}
                    </span>
                  </div>

                  <span
                    className={`grid h-8 w-8 place-items-center rounded-lg ${
                      day.status === "completed"
                        ? "bg-accent text-[color:var(--accent-ink)]"
                        : day.status === "rest"
                          ? "bg-slate-800 text-slate-500"
                          : "bg-zinc850 text-slate-300"
                    }`}
                  >
                    {day.status === "completed" ? (
                      <CheckIcon className="h-4 w-4" strokeWidth={3.5} />
                    ) : (
                      <Icon className="h-4 w-4" strokeWidth={2.4} />
                    )}
                  </span>

                  <p className="text-sm font-bold leading-tight text-white">
                    {day.title}
                  </p>
                  <p className="mt-auto text-[11px] leading-tight text-slate-500">
                    {day.focus}
                  </p>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <section className="rounded-xl border border-hairline bg-panel p-5 shadow-panel">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-xl font-extrabold tracking-tight text-white">
            {selected.title}
          </h2>
          <StatusBadge status={selected.status} />
          <span className="ml-auto text-xs font-medium text-slate-500">
            {selected.weekday} · {selected.focus}
          </span>
        </div>

        <ul className="mt-4 divide-y divide-hairline border-t border-hairline">
          {selected.blocks.map((block, i) => (
            <li key={block} className="flex items-center gap-3 py-3">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-zinc850 text-[11px] font-bold text-slate-500">
                {i + 1}
              </span>
              <span className="text-sm font-semibold text-slate-200">
                {block}
              </span>
            </li>
          ))}
        </ul>

        {selected.status === "scheduled" && (
          <button className="mt-4 rounded-xl bg-accent px-5 py-2.5 text-sm font-extrabold text-[color:var(--accent-ink)] shadow-accent transition-transform duration-150 ease-swift active:scale-[0.98]">
            Load into logger
          </button>
        )}
      </section>
    </div>
  );
}
