import { useState } from "react";
import {
  CopyIcon,
  DumbbellIcon,
  FootprintsIcon,
  LayoutTemplateIcon,
  PlayIcon,
  PlusIcon,
} from "lucide-react";
import { TemplateBuilder } from "./TemplateBuilder";
import type { TemplatesApi } from "../../hooks/useTemplates";
import type { WorkoutTemplate } from "../../types/workout";

type Mode = { kind: "idle" } | { kind: "new" } | { kind: "edit"; id: string };

interface TemplatesProps {
  templatesApi: TemplatesApi;
  onUseTemplate: (template: WorkoutTemplate) => void;
}

export function Templates({ templatesApi, onUseTemplate }: TemplatesProps) {
  const { templates, saveTemplate, deleteTemplate, duplicateTemplate } =
    templatesApi;
  const [mode, setMode] = useState<Mode>({ kind: "idle" });

  const editing =
    mode.kind === "edit"
      ? (templates.find((t) => t.id === mode.id) ?? null)
      : null;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white md:text-3xl">
            Templates
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Reusable session blueprints you can load straight into the logger
          </p>
        </div>
        <button
          onClick={() => setMode({ kind: "new" })}
          className="flex items-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-extrabold text-[color:var(--accent-ink)] shadow-accent transition-transform duration-150 ease-swift active:scale-[0.98]"
        >
          <PlusIcon className="h-4 w-4" strokeWidth={3.2} />
          New Template
        </button>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)]">
        <section aria-label="Saved templates" className="space-y-2">
          {templates.map((template) => {
            const Icon =
              template.type === "running" ? FootprintsIcon : DumbbellIcon;
            const isActive = mode.kind === "edit" && mode.id === template.id;
            return (
              <article
                key={template.id}
                className={`rounded-xl border bg-panel p-3 shadow-panel transition-colors duration-150 ease-swift ${
                  isActive
                    ? "border-accent"
                    : "border-hairline hover:border-slate-700"
                }`}
              >
                <button
                  onClick={() => setMode({ kind: "edit", id: template.id })}
                  className="flex w-full items-center gap-3 text-left"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-zinc850 text-slate-400">
                    <Icon className="h-4 w-4" strokeWidth={2.2} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-white">
                      {template.name}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      {template.summary}
                    </p>
                  </div>
                </button>

                <div className="mt-2.5 flex items-center gap-2 border-t border-hairline pt-2.5">
                  <button
                    onClick={() => onUseTemplate(template)}
                    className="flex items-center gap-1.5 rounded-lg bg-zinc850 px-2.5 py-1.5 text-xs font-bold text-slate-200 transition-colors duration-150 ease-swift hover:text-accent active:scale-[0.97]"
                  >
                    <PlayIcon className="h-3 w-3" strokeWidth={3} />
                    Start
                  </button>
                  <button
                    onClick={() => duplicateTemplate(template.id)}
                    className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-bold text-slate-500 transition-colors duration-150 ease-swift hover:text-slate-200"
                  >
                    <CopyIcon className="h-3 w-3" strokeWidth={2.6} />
                    Duplicate
                  </button>
                  <span className="ml-auto text-[11px] font-semibold tabular-nums text-slate-600">
                    {template.exercises.length} ex
                  </span>
                </div>
              </article>
            );
          })}

          {templates.length === 0 && (
            <p className="rounded-xl border border-dashed border-slate-800 px-4 py-8 text-center text-sm text-slate-500">
              No templates saved yet.
            </p>
          )}
        </section>

        {mode.kind === "idle" ? (
          <section className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-800 bg-panel/60 px-6 py-16 text-center">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent-soft">
              <LayoutTemplateIcon
                className="h-5 w-5 text-accent"
                strokeWidth={2.4}
              />
            </span>
            <h2 className="mt-4 text-lg font-bold text-white">
              Build a reusable session
            </h2>
            <p className="mt-1 max-w-sm text-sm text-slate-500">
              Pick a saved template to edit it, or create a new one with your
              exercise order, target reps, and set counts baked in.
            </p>
            <button
              onClick={() => setMode({ kind: "new" })}
              className="mt-5 rounded-xl border border-hairline bg-zinc850 px-5 py-2.5 text-sm font-bold text-slate-100 transition-colors duration-150 ease-swift hover:border-accent hover:text-accent active:scale-[0.98]"
            >
              New template
            </button>
          </section>
        ) : (
          <TemplateBuilder
            key={mode.kind === "edit" ? mode.id : "new"}
            template={editing}
            onSave={(template) => {
              void saveTemplate(template);
              setMode({ kind: "edit", id: template.id });
            }}
            onDelete={
              editing
                ? () => {
                    deleteTemplate(editing.id);
                    setMode({ kind: "idle" });
                  }
                : undefined
            }
            onCancel={() => setMode({ kind: "idle" })}
          />
        )}
      </div>
    </div>
  );
}
