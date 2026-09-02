import { CheckIcon, PlusIcon, Trash2Icon, XIcon } from "lucide-react";
import { exerciseLibrary } from "../../data/exercises";
import type { ExerciseRow, SetRow } from "../../types/workout";

interface ExerciseCardProps {
  exercise: ExerciseRow;
  index: number;
  unit: string;
  onUpdate: (next: Partial<ExerciseRow>) => void;
  onRemove: () => void;
  onAddSet: () => void;
  onRemoveSet: (setId: string) => void;
  onUpdateSet: (setId: string, next: Partial<SetRow>) => void;
  onToggleSet: (setId: string) => void;
}

export function ExerciseCard({
  exercise,
  index,
  unit,
  onUpdate,
  onRemove,
  onAddSet,
  onRemoveSet,
  onUpdateSet,
  onToggleSet,
}: ExerciseCardProps) {
  const listId = `exercise-options-${exercise.id}`;
  const doneCount = exercise.sets.filter((s) => s.done).length;

  return (
    <article className="rounded-xl border border-hairline bg-zinc850">
      <div className="flex items-center gap-2 border-b border-hairline p-3">
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-slate-800 text-xs font-bold text-slate-400">
          {index + 1}
        </span>
        <input
          value={exercise.name}
          onChange={(e) => onUpdate({ name: e.target.value })}
          list={listId}
          placeholder="Exercise name"
          aria-label={`Exercise ${index + 1} name`}
          className="min-w-0 flex-1 rounded-lg bg-transparent px-1 py-1 text-[15px] font-bold text-white outline-none placeholder:font-medium placeholder:text-slate-600 focus:bg-slate-800/60"
        />

        <datalist id={listId}>
          {exerciseLibrary.map((name) => (
            <option key={name} value={name} />
          ))}
        </datalist>

        <input
          value={exercise.targetReps}
          onChange={(e) => onUpdate({ targetReps: e.target.value })}
          aria-label={`Target reps for exercise ${index + 1}`}
          className="w-[72px] shrink-0 rounded-full border border-accent-soft bg-accent-soft px-2 py-1 text-center text-xs font-bold text-accent outline-none focus:border-accent"
        />

        <button
          onClick={onRemove}
          aria-label={`Remove ${exercise.name || "exercise"}`}
          className="shrink-0 rounded-lg p-1.5 text-slate-600 transition-colors duration-150 ease-swift hover:bg-slate-800 hover:text-rose-400"
        >
          <Trash2Icon className="h-4 w-4" />
        </button>
      </div>

      <div className="p-3">
        <div
          className="grid items-center gap-2 px-1 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-600"
          style={{
            gridTemplateColumns: "28px minmax(56px,1fr) 1fr 1fr 44px 24px",
          }}
        >
          <span>Set</span>
          <span>Previous</span>
          <span>{unit}</span>
          <span>Reps</span>
          <span className="text-center">Done</span>
          <span className="sr-only">Remove set</span>
        </div>

        <ul className="space-y-1.5">
          {exercise.sets.map((set, i) => (
            <li
              key={set.id}
              className="grid items-center gap-2"
              style={{
                gridTemplateColumns: "28px minmax(56px,1fr) 1fr 1fr 44px 24px",
              }}
            >
              <span
                className={`grid h-7 w-7 place-items-center rounded-md text-xs font-bold tabular-nums ${
                  set.done
                    ? "bg-accent-soft text-accent"
                    : "bg-slate-800 text-slate-400"
                }`}
              >
                {i + 1}
              </span>

              <span className="truncate text-xs font-medium tabular-nums text-slate-600">
                {set.previous ?? "—"}
              </span>

              <input
                inputMode="decimal"
                value={set.weight}
                onChange={(e) =>
                  onUpdateSet(set.id, { weight: e.target.value })
                }
                placeholder="0"
                aria-label={`Set ${i + 1} weight`}
                className={`h-10 w-full rounded-lg border bg-panel px-2 text-center text-sm font-bold tabular-nums outline-none transition-colors duration-150 ease-swift focus:border-accent ${
                  set.done
                    ? "border-accent-soft text-white"
                    : "border-hairline text-slate-100"
                } placeholder:font-medium placeholder:text-slate-700`}
              />

              <input
                inputMode="numeric"
                value={set.reps}
                onChange={(e) => onUpdateSet(set.id, { reps: e.target.value })}
                placeholder="0"
                aria-label={`Set ${i + 1} reps`}
                className={`h-10 w-full rounded-lg border bg-panel px-2 text-center text-sm font-bold tabular-nums outline-none transition-colors duration-150 ease-swift focus:border-accent ${
                  set.done
                    ? "border-accent-soft text-white"
                    : "border-hairline text-slate-100"
                } placeholder:font-medium placeholder:text-slate-700`}
              />

              <button
                onClick={() => onToggleSet(set.id)}
                aria-pressed={set.done}
                aria-label={`Mark set ${i + 1} complete`}
                className={`grid h-10 w-11 place-items-center rounded-lg border transition-[background-color,border-color,transform] duration-150 ease-swift active:scale-95 ${
                  set.done
                    ? "animate-setpulse border-accent bg-accent text-[color:var(--accent-ink)]"
                    : "border-hairline bg-panel text-slate-600 hover:border-slate-600 hover:text-slate-300"
                }`}
              >
                <CheckIcon className="h-5 w-5" strokeWidth={3} />
              </button>

              <button
                onClick={() => onRemoveSet(set.id)}
                aria-label={`Remove set ${i + 1}`}
                className="grid h-6 w-6 place-items-center rounded-md text-slate-700 transition-colors duration-150 ease-swift hover:bg-slate-800 hover:text-slate-300"
              >
                <XIcon className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>

        <div className="mt-3 flex items-center gap-3">
          <button
            onClick={onAddSet}
            className="flex items-center gap-1 rounded-lg border border-dashed border-slate-700 px-3 py-1.5 text-xs font-bold text-slate-400 transition-colors duration-150 ease-swift hover:border-accent hover:text-accent active:scale-[0.98]"
          >
            <PlusIcon className="h-3.5 w-3.5" strokeWidth={3} />
            Add Set
          </button>
          <span className="text-[11px] font-medium tabular-nums text-slate-600">
            {doneCount}/{exercise.sets.length} sets complete
          </span>
        </div>
      </div>
    </article>
  );
}
