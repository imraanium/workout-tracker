import { ChevronRightIcon, DumbbellIcon, FootprintsIcon } from "lucide-react";
import { recentWorkouts, weekSummary } from "../data/history";

export function RecentActivity() {
  return (
    <section aria-labelledby="recent-heading" className="space-y-3">
      <div className="flex items-baseline gap-3">
        <h2
          id="recent-heading"
          className="text-sm font-bold uppercase tracking-wide text-slate-400"
        >
          Recent Activity
        </h2>
        <span className="text-xs text-slate-600">
          {weekSummary.sessions} sessions ·{" "}
          {weekSummary.volume.toLocaleString()} lbs this week
        </span>
      </div>

      <ol className="relative space-y-2 pl-5">
        <span
          className="absolute left-1.5 top-2 bottom-2 w-px bg-hairline"
          aria-hidden="true"
        />
        {recentWorkouts.map((workout) => {
          const Icon =
            workout.type === "running" ? FootprintsIcon : DumbbellIcon;
          return (
            <li key={workout.id} className="relative">
              <span
                className="absolute -left-[15px] top-5 h-2 w-2 rounded-full bg-slate-700 ring-4 ring-canvas"
                aria-hidden="true"
              />

              <button className="group flex w-full items-center gap-3 rounded-xl border border-hairline bg-panel px-4 py-3 text-left shadow-panel transition-colors duration-150 ease-swift hover:border-slate-700">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-zinc850 text-slate-400">
                  <Icon className="h-4 w-4" strokeWidth={2.2} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-bold text-white">
                      {workout.name}
                    </p>
                    <span className="shrink-0 text-[11px] font-medium text-slate-600">
                      {workout.relative}
                    </span>
                  </div>
                  <p className="truncate text-xs text-slate-500">
                    {workout.detail}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-bold tabular-nums text-slate-200">
                    {workout.volume > 0
                      ? `${(workout.volume / 1000).toFixed(1)}k`
                      : workout.duration}
                  </p>
                  <p className="text-[11px] text-slate-600">
                    {workout.volume > 0
                      ? `lbs · ${workout.sets} sets`
                      : workout.date}
                  </p>
                </div>
                <ChevronRightIcon className="h-4 w-4 shrink-0 text-slate-700 transition-colors duration-150 ease-swift group-hover:text-slate-400" />
              </button>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
