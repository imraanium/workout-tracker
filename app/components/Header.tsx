import { FlameIcon, DumbbellIcon } from "lucide-react";
import { SegmentedTabs } from "./Navigation";
import type { TabId } from "../types/workout";

interface HeaderProps {
  active: TabId;
  onChange: (tab: TabId) => void;
  onOpenWarmUp: () => void;
  today: string;
}

export function Header({ active, onChange, onOpenWarmUp, today }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-hairline bg-canvas/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 md:px-6">
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-accent text-[color:var(--accent-ink)]">
            <DumbbellIcon className="h-5 w-5" strokeWidth={2.6} />
          </span>
          <span className="text-[15px] font-extrabold uppercase tracking-tight text-white">
            Iron<span className="text-accent">log</span>
          </span>
        </div>

        <span className="ml-1 hidden text-sm font-medium text-slate-500 sm:block md:hidden lg:block">
          {today}
        </span>

        <div className="ml-auto flex items-center gap-2">
          <SegmentedTabs active={active} onChange={onChange} />

          <button
            onClick={onOpenWarmUp}
            className="flex items-center gap-1.5 rounded-xl border border-hairline bg-panel px-3 py-2 text-sm font-semibold text-slate-300 transition-colors duration-150 ease-swift hover:border-accent hover:text-white active:scale-[0.97]"
          >
            <FlameIcon className="h-4 w-4 text-accent" strokeWidth={2.4} />
            <span className="hidden lg:inline">Warm-Up</span>
          </button>

          <button
            className="flex items-center gap-2 rounded-xl border border-hairline bg-panel p-1 pr-1 transition-colors duration-150 ease-swift hover:border-slate-600"
            aria-label="Account: Maya Ellis, signed in"
          >
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-slate-800 text-[11px] font-bold text-slate-200">
              ME
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
