import {
  CalendarRangeIcon,
  LayoutDashboardIcon,
  LayoutTemplateIcon,
  TrendingUpIcon,
} from "lucide-react";
import type { TabId } from "../types/workout";

export const tabs: {
  id: TabId;
  label: string;
  shortLabel: string;
  icon: typeof LayoutDashboardIcon;
}[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    shortLabel: "Log",
    icon: LayoutDashboardIcon,
  },
  {
    id: "plan",
    label: "Weekly Plan",
    shortLabel: "Plan",
    icon: CalendarRangeIcon,
  },
  {
    id: "templates",
    label: "Templates",
    shortLabel: "Templates",
    icon: LayoutTemplateIcon,
  },
  {
    id: "progression",
    label: "Progression",
    shortLabel: "Progress",
    icon: TrendingUpIcon,
  },
];

interface NavProps {
  active: TabId;
  onChange: (tab: TabId) => void;
}

export function SegmentedTabs({ active, onChange }: NavProps) {
  return (
    <div
      role="tablist"
      aria-label="Sections"
      className="hidden items-center gap-1 rounded-xl border border-hairline bg-panel p-1 md:flex"
    >
      {tabs.map((tab) => {
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold transition-colors duration-150 ease-swift lg:px-4 ${
              isActive
                ? "bg-accent text-[color:var(--accent-ink)]"
                : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-100"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

export function BottomNav({ active, onChange }: NavProps) {
  return (
    <nav
      aria-label="Sections"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-hairline bg-canvas/95 backdrop-blur md:hidden"
    >
      <div className="mx-auto grid max-w-md grid-cols-4 px-2 pb-[env(safe-area-inset-bottom)]">
        {tabs.map((tab) => {
          const isActive = tab.id === active;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              aria-current={isActive ? "page" : undefined}
              onClick={() => onChange(tab.id)}
              className="relative flex flex-col items-center gap-1 py-3 transition-colors duration-150 ease-swift"
            >
              {isActive && (
                <span
                  className="absolute top-0 h-0.5 w-10 rounded-full bg-accent"
                  aria-hidden="true"
                />
              )}
              <Icon
                className={`h-5 w-5 ${isActive ? "text-accent" : "text-slate-500"}`}
                strokeWidth={isActive ? 2.4 : 2}
              />

              <span
                className={`text-[11px] font-semibold ${isActive ? "text-slate-100" : "text-slate-500"}`}
              >
                {tab.shortLabel}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
