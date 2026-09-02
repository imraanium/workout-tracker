import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDownIcon, LayersIcon } from "lucide-react";
import type { WorkoutTemplate } from "../../types/workout";

interface TemplateMenuProps {
  templates: WorkoutTemplate[];
  onSelect: (template: WorkoutTemplate) => void;
}

export function TemplateMenu({ templates, onSelect }: TemplateMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-hairline bg-panel px-4 py-3 text-sm font-bold text-slate-200 transition-colors duration-150 ease-swift hover:border-slate-600 active:scale-[0.98] sm:w-auto"
      >
        <LayersIcon className="h-4 w-4 text-slate-400" strokeWidth={2.4} />
        Load Template
        <ChevronDownIcon
          className={`h-4 w-4 text-slate-500 transition-transform duration-200 ease-swift ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="menu"
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
            className="absolute right-0 z-20 mt-2 max-h-80 w-72 origin-top overflow-y-auto rounded-xl border border-hairline bg-panel p-1.5 shadow-panel"
          >
            {templates.map((template) => (
              <li key={template.id} role="none">
                <button
                  role="menuitem"
                  onClick={() => {
                    onSelect(template);
                    setOpen(false);
                  }}
                  className="w-full rounded-lg px-3 py-2.5 text-left transition-colors duration-150 ease-swift hover:bg-zinc850"
                >
                  <p className="text-sm font-bold text-white">
                    {template.name}
                  </p>
                  <p className="text-xs text-slate-500">{template.summary}</p>
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
