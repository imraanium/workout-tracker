import { motion } from "framer-motion";
import { DumbbellIcon, FootprintsIcon, PlusIcon, XIcon } from "lucide-react";
import { ExerciseCard } from "./ExerciseCard";
import type { WorkoutLoggerApi } from "./useWorkoutLogger";
import type { WorkoutType } from "../../types/workout";

const typeOptions: {
  id: WorkoutType;
  label: string;
  icon: typeof DumbbellIcon;
}[] = [
  { id: "strength", label: "Strength Training", icon: DumbbellIcon },
  { id: "running", label: "Running", icon: FootprintsIcon },
];

interface WorkoutLoggerProps {
  logger: WorkoutLoggerApi;
  unit: string;
  onClose: () => void;
}

export function WorkoutLogger({ logger, unit, onClose }: WorkoutLoggerProps) {
  const { draft, stats } = logger;
  const progress =
    stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <motion.section
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.24, ease: [0.23, 1, 0.32, 1] }}
      aria-labelledby="logger-heading"
      className="overflow-hidden rounded-xl border border-hairline bg-panel shadow-panel"
    >
      <div className="border-b border-hairline p-4 md:p-5">
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <p
              id="logger-heading"
              className="text-[11px] font-bold uppercase tracking-widest text-accent"
            >
              Active Session
            </p>
            <input
              value={draft.name}
              onChange={(e) => logger.setName(e.target.value)}
              aria-label="Workout name"
              placeholder="Name this workout"
              className="mt-1 w-full rounded-lg bg-transparent text-2xl font-extrabold tracking-tight text-white outline-none placeholder:text-slate-700 focus:bg-slate-800/40 md:text-3xl"
            />
          </div>
          <button
            onClick={onClose}
            aria-label="Close logger"
            className="rounded-lg p-1.5 text-slate-500 transition-colors duration-150 ease-swift hover:bg-slate-800 hover:text-white"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <div className="flex gap-1 rounded-full border border-hairline bg-zinc850 p-1">
            {typeOptions.map((option) => {
              const isActive = draft.type === option.id;
              const Icon = option.icon;
              return (
                <button
                  key={option.id}
                  onClick={() => logger.setType(option.id)}
                  aria-pressed={isActive}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-colors duration-150 ease-swift ${
                    isActive
                      ? "bg-accent text-[color:var(--accent-ink)]"
                      : "text-slate-400 hover:text-slate-100"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" strokeWidth={2.6} />
                  {option.label}
                </button>
              );
            })}
          </div>

          <input
            type="datetime-local"
            value={draft.dateTime}
            onChange={(e) => logger.setDateTime(e.target.value)}
            aria-label="Workout date and time"
            className="rounded-full border border-hairline bg-zinc850 px-3 py-1.5 text-xs font-semibold text-slate-300 outline-none transition-colors duration-150 ease-swift focus:border-accent [color-scheme:dark]"
          />
        </div>

        <div className="mt-4 flex items-center gap-3">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-accent transition-[width] duration-300 ease-swift"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="shrink-0 text-xs font-bold tabular-nums text-slate-400">
            {stats.completed}/{stats.total} sets
            <span className="ml-2 font-medium text-slate-600">
              {stats.volume.toLocaleString()} {unit}
            </span>
          </p>
        </div>
      </div>

      <div className="space-y-3 p-4 md:p-5">
        {draft.exercises.map((exercise, index) => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            index={index}
            unit={unit}
            onUpdate={(next) => logger.updateExercise(exercise.id, next)}
            onRemove={() => logger.removeExercise(exercise.id)}
            onAddSet={() => logger.addSet(exercise.id)}
            onRemoveSet={(setId) => logger.removeSet(exercise.id, setId)}
            onUpdateSet={(setId, next) =>
              logger.updateSet(exercise.id, setId, next)
            }
            onToggleSet={(setId) => logger.toggleSet(exercise.id, setId)}
          />
        ))}

        {draft.exercises.length === 0 && (
          <p className="rounded-xl border border-dashed border-slate-800 px-4 py-8 text-center text-sm text-slate-500">
            No exercises yet — add the first one below.
          </p>
        )}

        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            onClick={logger.addExercise}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-dashed border-slate-700 px-4 py-3 text-sm font-bold text-slate-300 transition-colors duration-150 ease-swift hover:border-accent hover:text-accent active:scale-[0.99]"
          >
            <PlusIcon className="h-4 w-4" strokeWidth={3} />
            Add Exercise
          </button>
          <button
            onClick={onClose}
            className="rounded-xl bg-accent px-6 py-3 text-sm font-extrabold text-[color:var(--accent-ink)] shadow-accent transition-transform duration-150 ease-swift active:scale-[0.98]"
          >
            Finish Workout
          </button>
        </div>
      </div>
    </motion.section>
  );
}
