import { AnimatePresence } from "framer-motion";
import { FlameIcon, PlusIcon } from "lucide-react";
import { WorkoutLogger } from "./logger/WorkoutLogger";
import { TemplateMenu } from "./logger/TemplateMenu";
import { RecentActivity } from "./RecentActivity";
import { weekSummary } from "../data/history";
import type { WorkoutLoggerApi } from "./logger/useWorkoutLogger";
import type { WorkoutTemplate } from "../types/workout";
import type { CompletedWorkout } from "../types/workout";

interface DashboardProps {
  logger: WorkoutLoggerApi;
  templates: WorkoutTemplate[];
  unit: string;
  loggerOpen: boolean;
  onOpenLogger: () => void;
  onCloseLogger: () => void;
  recentWorkouts: CompletedWorkout[];
}

export function Dashboard({
  logger,
  templates,
  unit,
  loggerOpen,
  onOpenLogger,
  onCloseLogger,
  recentWorkouts,
}: DashboardProps) {
  const handleTemplate = (template: WorkoutTemplate) => {
    logger.loadTemplate(template);
    onOpenLogger();
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <button
          onClick={onOpenLogger}
          className="flex items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-extrabold text-[color:var(--accent-ink)] shadow-accent transition-transform duration-150 ease-swift active:scale-[0.98]"
        >
          <PlusIcon className="h-4 w-4" strokeWidth={3.2} />
          Log Workout
        </button>
        <TemplateMenu templates={templates} onSelect={handleTemplate} />
        <p className="hidden text-xs font-medium text-slate-600 sm:ml-auto sm:block">
          {weekSummary.streak}-day streak · {weekSummary.sets} sets logged this
          week
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)]">
        <div className="space-y-5">
          <AnimatePresence mode="wait">
            {loggerOpen ? (
              <WorkoutLogger
                key="logger"
                logger={logger}
                unit={unit}
                onClose={onCloseLogger}
              />
            ) : (
              <section
                key="empty"
                className="rounded-xl border border-dashed border-slate-800 bg-panel/60 px-6 py-12 text-center"
              >
                <span className="mx-auto grid h-11 w-11 place-items-center rounded-xl bg-accent-soft">
                  <FlameIcon
                    className="h-5 w-5 text-accent"
                    strokeWidth={2.4}
                  />
                </span>
                <h2 className="mt-4 text-lg font-bold text-white">
                  Nothing logged today
                </h2>
                <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">
                  Push Day A is up next in your plan. Start from a template or
                  build the session as you go.
                </p>
                <button
                  onClick={onOpenLogger}
                  className="mt-5 rounded-xl border border-hairline bg-zinc850 px-5 py-2.5 text-sm font-bold text-slate-100 transition-colors duration-150 ease-swift hover:border-accent hover:text-accent active:scale-[0.98]"
                >
                  Start a session
                </button>
              </section>
            )}
          </AnimatePresence>
        </div>

        <RecentActivity workouts={recentWorkouts} />
      </div>
    </div>
  );
}
