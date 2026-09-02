import { useState } from "react";
import { motion } from "framer-motion";
import {
  DumbbellIcon,
  FootprintsIcon,
  MinusIcon,
  PlusIcon,
  Trash2Icon,
} from "lucide-react";
import { exerciseLibrary } from "../../data/exercises";
import { summarizeTemplate, templateId } from "../../utils/templates";
import type { WorkoutTemplate, WorkoutType } from "../../types/workout";

const typeOptions: {
  id: WorkoutType;
  label: string;
  icon: typeof DumbbellIcon;
}[] = [
  { id: "strength", label: "Strength Training", icon: DumbbellIcon },
  { id: "running", label: "Running", icon: FootprintsIcon },
];

interface TemplateBuilderProps {
  template: WorkoutTemplate | null;
  onSave: (template: WorkoutTemplate) => void;
  onDelete?: () => void;
  onCancel: () => void;
}

export function TemplateBuilder({
  template,
  onSave,
  onDelete,
  onCancel,
}: TemplateBuilderProps) {
  const [name, setName] = useState(template?.name ?? "");
  const [type, setType] = useState<WorkoutType>(template?.type ?? "strength");
  const [exercises, setExercises] = useState(
    template?.exercises ?? [{ name: "", targetReps: "3 × 8", sets: 3 }],
  );

  const isNew = template === null;
  const canSave =
    name.trim().length > 0 && exercises.some((ex) => ex.name.trim().length > 0);

  const updateExercise = (
    index: number,
    next: Partial<(typeof exercises)[number]>,
  ) =>
    setExercises((prev) =>
      prev.map((ex, i) => (i === index ? { ...ex, ...next } : ex)),
    );

  const handleSave = () => {
    const cleaned = exercises.filter((ex) => ex.name.trim().length > 0);
    onSave({
      id: template?.id ?? templateId(name),
      name: name.trim(),
      type,
      summary: summarizeTemplate({ name, type, exercises: cleaned }),
      exercises: cleaned,
    });
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
      aria-label={isNew ? "New template" : `Edit ${template?.name}`}
      className="overflow-hidden rounded-xl border border-hairline bg-panel shadow-panel"
    >
      <div className="border-b border-hairline p-4 md:p-5">
        <p className="text-[11px] font-bold uppercase tracking-widest text-accent">
          {isNew ? "New Template" : "Editing Template"}
        </p>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Template name"
          aria-label="Template name"
          className="mt-1 w-full rounded-lg bg-transparent text-2xl font-extrabold tracking-tight text-white outline-none placeholder:text-slate-700 focus:bg-slate-800/40 md:text-3xl"
        />

        <div className="mt-4 flex gap-1 rounded-full border border-hairline bg-zinc850 p-1 w-fit">
          {typeOptions.map((option) => {
            const Icon = option.icon;
            const isActive = type === option.id;
            return (
              <button
                key={option.id}
                onClick={() => setType(option.id)}
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
      </div>

      <div className="p-4 md:p-5">
        <div
          className="grid items-center gap-2 px-1 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-600"
          style={{ gridTemplateColumns: "24px minmax(0,1fr) 92px 104px 28px" }}
        >
          <span>#</span>
          <span>Exercise</span>
          <span>Target</span>
          <span className="text-center">Sets</span>
          <span className="sr-only">Remove</span>
        </div>

        <ul className="space-y-2">
          {exercises.map((exercise, index) => (
            <li
              key={index}
              className="grid items-center gap-2"
              style={{
                gridTemplateColumns: "24px minmax(0,1fr) 92px 104px 28px",
              }}
            >
              <span className="grid h-7 w-6 place-items-center rounded-md bg-slate-800 text-[11px] font-bold text-slate-400">
                {index + 1}
              </span>

              <input
                value={exercise.name}
                onChange={(e) =>
                  updateExercise(index, { name: e.target.value })
                }
                list="template-exercise-options"
                placeholder="Exercise name"
                aria-label={`Exercise ${index + 1} name`}
                className="h-10 min-w-0 rounded-lg border border-hairline bg-zinc850 px-3 text-sm font-bold text-white outline-none transition-colors duration-150 ease-swift focus:border-accent placeholder:font-medium placeholder:text-slate-700"
              />

              <input
                value={exercise.targetReps}
                onChange={(e) =>
                  updateExercise(index, { targetReps: e.target.value })
                }
                aria-label={`Exercise ${index + 1} target`}
                className="h-10 rounded-lg border border-accent-soft bg-accent-soft px-2 text-center text-xs font-bold text-accent outline-none focus:border-accent"
              />

              <div className="flex h-10 items-center justify-between rounded-lg border border-hairline bg-zinc850 px-1">
                <button
                  onClick={() =>
                    updateExercise(index, {
                      sets: Math.max(1, exercise.sets - 1),
                    })
                  }
                  aria-label={`Decrease sets for exercise ${index + 1}`}
                  className="grid h-7 w-7 place-items-center rounded-md text-slate-400 transition-colors duration-150 ease-swift hover:bg-slate-800 hover:text-white active:scale-95"
                >
                  <MinusIcon className="h-3.5 w-3.5" strokeWidth={3} />
                </button>
                <span className="text-sm font-bold tabular-nums text-white">
                  {exercise.sets}
                </span>
                <button
                  onClick={() =>
                    updateExercise(index, {
                      sets: Math.min(10, exercise.sets + 1),
                    })
                  }
                  aria-label={`Increase sets for exercise ${index + 1}`}
                  className="grid h-7 w-7 place-items-center rounded-md text-slate-400 transition-colors duration-150 ease-swift hover:bg-slate-800 hover:text-white active:scale-95"
                >
                  <PlusIcon className="h-3.5 w-3.5" strokeWidth={3} />
                </button>
              </div>

              <button
                onClick={() =>
                  setExercises((prev) => prev.filter((_, i) => i !== index))
                }
                aria-label={`Remove exercise ${index + 1}`}
                className="grid h-7 w-7 place-items-center rounded-md text-slate-700 transition-colors duration-150 ease-swift hover:bg-slate-800 hover:text-rose-400"
              >
                <Trash2Icon className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>

        <datalist id="template-exercise-options">
          {exerciseLibrary.map((option) => (
            <option key={option} value={option} />
          ))}
        </datalist>

        <button
          onClick={() =>
            setExercises((prev) => [
              ...prev,
              { name: "", targetReps: "3 × 8", sets: 3 },
            ])
          }
          className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-slate-700 px-4 py-3 text-sm font-bold text-slate-300 transition-colors duration-150 ease-swift hover:border-accent hover:text-accent active:scale-[0.99]"
        >
          <PlusIcon className="h-4 w-4" strokeWidth={3} />
          Add Exercise
        </button>

        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-hairline pt-4">
          <button
            onClick={handleSave}
            disabled={!canSave}
            className="rounded-xl bg-accent px-5 py-2.5 text-sm font-extrabold text-[color:var(--accent-ink)] shadow-accent transition-transform duration-150 ease-swift active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-slate-800 disabled:text-slate-600 disabled:shadow-none"
          >
            {isNew ? "Create Template" : "Save Changes"}
          </button>
          <button
            onClick={onCancel}
            className="rounded-xl border border-hairline bg-zinc850 px-4 py-2.5 text-sm font-bold text-slate-300 transition-colors duration-150 ease-swift hover:border-slate-600 hover:text-white"
          >
            Cancel
          </button>
          {onDelete && (
            <button
              onClick={onDelete}
              className="ml-auto rounded-xl px-3 py-2.5 text-sm font-bold text-slate-500 transition-colors duration-150 ease-swift hover:text-rose-400"
            >
              Delete template
            </button>
          )}
        </div>
      </div>
    </motion.section>
  );
}
