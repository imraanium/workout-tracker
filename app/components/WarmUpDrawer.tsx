import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDownIcon, FlameIcon, XIcon } from "lucide-react";
import type { WarmUpGroup } from "../types/workout";

interface WarmUpDrawerProps {
  open: boolean;
  onClose: () => void;
  warmups: WarmUpGroup[];
}

export function WarmUpDrawer({ open, onClose, warmups }: WarmUpDrawerProps) {
  const [expanded, setExpanded] = useState<string | null>(warmups[0]?.id ?? null);

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-50 flex justify-end"
          role="dialog"
          aria-label="Warm-up reference"
        >
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70"
            aria-label="Close warm-up reference"
          />

          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
            className="relative flex h-full w-full max-w-md flex-col border-l border-hairline bg-panel"
          >
            <div className="flex items-start gap-3 border-b border-hairline px-5 py-4">
              <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-accent-soft">
                <FlameIcon className="h-5 w-5 text-accent" strokeWidth={2.4} />
              </span>
              <div className="min-w-0">
                <h2 className="text-base font-bold text-white">
                  Warm-Up Reference
                </h2>
                <p className="text-xs text-slate-500">
                  8–12 minutes before the first working set
                </p>
              </div>
              <button
                onClick={onClose}
                className="ml-auto rounded-lg p-1.5 text-slate-500 transition-colors duration-150 ease-swift hover:bg-slate-800 hover:text-white"
                aria-label="Close"
              >
                <XIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4">
              <ul className="space-y-2.5">
                {warmups.map((group) => {
                  const isOpen = expanded === group.id;
                  return (
                    <li
                      key={group.id}
                      className="overflow-hidden rounded-xl border border-hairline bg-zinc850"
                    >
                      <button
                        onClick={() => setExpanded(isOpen ? null : group.id)}
                        aria-expanded={isOpen}
                        className="flex w-full items-center gap-3 px-4 py-3.5 text-left"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-white">
                            {group.title}
                          </p>
                          <p className="truncate text-xs text-slate-500">
                            {group.note}
                          </p>
                        </div>
                        <span className="rounded-md bg-slate-800 px-1.5 py-0.5 text-[11px] font-semibold text-slate-400">
                          {group.items.length}
                        </span>
                        <ChevronDownIcon
                          className={`h-4 w-4 shrink-0 text-slate-500 transition-transform duration-200 ease-swift ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{
                              duration: 0.22,
                              ease: [0.23, 1, 0.32, 1],
                            }}
                            className="overflow-hidden"
                          >
                            <ul className="divide-y divide-hairline border-t border-hairline">
                              {group.items.map((item) => (
                                <li
                                  key={item.name}
                                  className="flex gap-3 px-4 py-3"
                                >
                                  <div className="min-w-0 flex-1">
                                    <p className="text-sm font-semibold text-slate-100">
                                      {item.name}
                                    </p>
                                    <p className="mt-0.5 text-xs leading-relaxed text-slate-500">
                                      {item.description}
                                    </p>
                                  </div>
                                  <span className="mt-0.5 h-fit shrink-0 rounded-md border border-accent-soft bg-accent-soft px-2 py-1 text-[11px] font-bold text-accent">
                                    {item.duration}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </li>
                  );
                })}
              </ul>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
