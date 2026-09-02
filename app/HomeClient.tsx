"use client";

import { useState } from "react";
import { Dashboard } from "./components/Dashboard";
import { Header } from "./components/Header";
import { BottomNav } from "./components/Navigation";
import { Progression } from "./components/progression/Progression";
import { Templates } from "./components/templates/Templates";
import { WarmUpDrawer } from "./components/WarmUpDrawer";
import { WeeklyPlan } from "./components/WeeklyPlan";
import { useTemplates } from "./hooks/useTemplates";
import { useWorkoutLogger } from "./components/logger/useWorkoutLogger";
import type { CompletedWorkout, TabId, WarmUpGroup, WorkoutTemplate } from "./types/workout";

export function HomeClient({ initialTemplates, recentWorkouts, warmups, userEmail }: {
  initialTemplates: WorkoutTemplate[]; recentWorkouts: CompletedWorkout[]; warmups: WarmUpGroup[]; userEmail: string | null;
}) {
  const [tab, setTab] = useState<TabId>("dashboard");
  const [warmUpOpen, setWarmUpOpen] = useState(false);
  const [loggerOpen, setLoggerOpen] = useState(true);
  const logger = useWorkoutLogger();
  const templatesApi = useTemplates(initialTemplates);
  return <div data-accent="lime" className="min-h-full w-full bg-canvas font-sans text-slate-200">
    <Header active={tab} onChange={setTab} onOpenWarmUp={() => setWarmUpOpen(true)} today={new Date().toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })} userEmail={userEmail} />
    <main className="mx-auto max-w-6xl px-4 pb-28 pt-5 md:px-6 md:pb-12 md:pt-6">
      {tab === "dashboard" && <Dashboard logger={logger} templates={templatesApi.templates} unit="lbs" loggerOpen={loggerOpen} onOpenLogger={() => setLoggerOpen(true)} onCloseLogger={() => setLoggerOpen(false)} recentWorkouts={recentWorkouts} />}
      {tab === "plan" && <WeeklyPlan />}
      {tab === "templates" && <Templates templatesApi={templatesApi} onUseTemplate={(template) => { logger.loadTemplate(template); setLoggerOpen(true); setTab("dashboard"); }} />}
      {tab === "progression" && <Progression />}
    </main>
    <BottomNav active={tab} onChange={setTab} />
    <WarmUpDrawer open={warmUpOpen} onClose={() => setWarmUpOpen(false)} warmups={warmups} />
  </div>;
}
