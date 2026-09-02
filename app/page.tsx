import { createClient } from "../lib/supabase/server";
import { HomeClient } from "./HomeClient";
import type {
  CompletedWorkout,
  WarmUpGroup,
  WorkoutTemplate,
} from "./types/workout";

export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [templatesResult, warmupsResult, workoutsResult] = await Promise.all([
    user
      ? supabase.from("templates").select("*").order("created_at")
      : Promise.resolve({ data: [], error: null }),
    supabase.from("warmup_references").select("*").order("category"),
    user
      ? supabase
          .from("workouts")
          .select("*")
          .order("logged_at", { ascending: false })
          .limit(8)
      : Promise.resolve({ data: [], error: null }),
  ]);
  const templates = (templatesResult.data ?? []) as NonNullable<
    typeof templatesResult.data
  >;
  const exerciseRows = templates.length
    ? ((
        await supabase
          .from("template_exercises")
          .select("*")
          .in(
            "template_id",
            templates.map((t) => t.id),
          )
      ).data ?? [])
    : [];
  const mappedTemplates: WorkoutTemplate[] = templates.map((template) => ({
    id: template.id,
    name: template.name,
    type: template.type,
    summary: template.description ?? "",
    exercises: exerciseRows
      .filter((exercise) => exercise.template_id === template.id)
      .sort((a, b) => a.order_index - b.order_index)
      .map((exercise) => ({
        name: exercise.exercise_name,
        targetReps: exercise.target_reps,
        sets: exercise.target_sets,
      })),
  }));
  const recentWorkouts: CompletedWorkout[] = (workoutsResult.data ?? []).map(
    (workout) => ({
      id: workout.id,
      name: workout.name,
      type: workout.type,
      date: new Date(workout.logged_at).toLocaleDateString(),
      relative: new Date(workout.logged_at).toLocaleDateString(),
      duration: "",
      volume: 0,
      sets: 0,
      detail: "Logged workout",
    }),
  );
  const warmups: WarmUpGroup[] = Object.entries(
    (warmupsResult.data ?? []).reduce<Record<string, WarmUpGroup>>(
      (groups, item) => {
        const group = groups[item.category] ?? {
          id: item.category,
          title: item.category,
          note: "Reference movements",
          items: [],
        };
        group.items.push({
          name: item.title,
          description: item.description,
          duration: "",
        });
        groups[item.category] = group;
        return groups;
      },
      {},
    ),
  ).map(([, group]) => group);
  return (
    <HomeClient
      initialTemplates={mappedTemplates}
      recentWorkouts={recentWorkouts}
      warmups={warmups}
      userEmail={user?.email ?? null}
    />
  );
}
