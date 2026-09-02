'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '../lib/supabase/server';
import type { ProgressSeries, WorkoutDraft, WorkoutTemplate } from './types/workout';

async function userContext() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('You must be signed in to perform this action.');
  return { supabase, user };
}

export async function saveTemplate(template: WorkoutTemplate) {
  const { supabase, user } = await userContext();
  const { data, error } = await supabase.from('templates').upsert({
    id: template.id.length > 20 ? template.id : undefined,
    user_id: user.id, name: template.name, description: template.summary, type: template.type,
  }).select('id').single();
  if (error) throw new Error(error.message);
  await supabase.from('template_exercises').delete().eq('template_id', data.id);
  const { error: exerciseError } = await supabase.from('template_exercises').insert(template.exercises.map((exercise, index) => ({
    template_id: data.id, exercise_name: exercise.name, order_index: index, target_sets: exercise.sets,
    target_reps: exercise.targetReps, target_weight: null, rest_seconds: null,
  })));
  if (exerciseError) throw new Error(exerciseError.message);
  revalidatePath('/');
  return data.id;
}

export async function deleteTemplate(id: string) {
  const { supabase } = await userContext();
  const { error } = await supabase.from('templates').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/');
}

export async function logWorkout(draft: WorkoutDraft, templateId?: string | null) {
  const { supabase, user } = await userContext();
  const { data: workout, error } = await supabase.from('workouts').insert({
    user_id: user.id, template_id: templateId ?? null, name: draft.name, type: draft.type,
    logged_at: new Date(draft.dateTime).toISOString(),
  }).select('id').single();
  if (error) throw new Error(error.message);
  const { data: exercises, error: exerciseError } = await supabase.from('workout_exercises').insert(
    draft.exercises.map((exercise, index) => ({ workout_id: workout.id, exercise_name: exercise.name, target_reps: exercise.targetReps, order_index: index })),
  ).select('id, order_index');
  if (exerciseError) throw new Error(exerciseError.message);
  const rows = draft.exercises.flatMap((exercise, index) => (exercises?.find((item) => item.order_index === index) ? exercise.sets.map((set, setIndex) => ({
    workout_exercise_id: exercises.find((item) => item.order_index === index)!.id, set_number: setIndex + 1,
    weight: Number(set.weight) || null, reps: Number(set.reps) || null, is_completed: set.done,
  })) : []));
  const { error: setsError } = rows.length ? await supabase.from('sets').insert(rows) : { error: null };
  if (setsError) throw new Error(setsError.message);
  revalidatePath('/');
}

export async function fetchPreviousStats(exerciseName: string) {
  const { supabase } = await userContext();
  const { data: exercises, error } = await supabase.from('workout_exercises').select('id, workout_id').eq('exercise_name', exerciseName);
  if (error) throw new Error(error.message);
  const workoutIds = (exercises ?? []).map((exercise) => exercise.workout_id);
  if (!workoutIds.length) return [];
  const { data: workouts, error: workoutError } = await supabase.from('workouts').select('id, logged_at').in('id', workoutIds).order('logged_at', { ascending: false }).limit(1);
  if (workoutError) throw new Error(workoutError.message);
  const latest = exercises.find((exercise) => exercise.workout_id === workouts?.[0]?.id);
  if (!latest) return [];
  const { data: sets, error: setsError } = await supabase.from('sets').select('weight, reps, set_number, is_completed').eq('workout_exercise_id', latest.id).order('set_number');
  if (setsError) throw new Error(setsError.message);
  return (sets ?? []).filter((set) => set.is_completed).map((set) => `${set.weight ?? 0} × ${set.reps ?? 0}`);
}

export async function fetchProgression() {
  const { supabase } = await userContext();
  const { data: exercises, error } = await supabase.from('workout_exercises').select('id, exercise_name, workout_id');
  if (error) throw new Error(error.message);
  const { data: workouts, error: workoutError } = await supabase.from('workouts').select('id, logged_at').order('logged_at');
  if (workoutError) throw new Error(workoutError.message);
  const { data: sets, error: setsError } = await supabase.from('sets').select('workout_exercise_id, weight, reps, is_completed');
  if (setsError) throw new Error(setsError.message);
  const names = [...new Set((exercises ?? []).map((exercise) => exercise.exercise_name))];
  return names.map((name): ProgressSeries => {
    const points = (workouts ?? []).filter((workout) => (exercises ?? []).some((exercise) => exercise.workout_id === workout.id && exercise.exercise_name === name)).map((workout) => {
      const ids = (exercises ?? []).filter((exercise) => exercise.workout_id === workout.id && exercise.exercise_name === name).map((exercise) => exercise.id);
      const completed = (sets ?? []).filter((set) => ids.includes(set.workout_exercise_id) && set.is_completed);
      const weight = completed.map((set) => Number(set.weight) || 0);
      return { date: new Date(workout.logged_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }), primary: Math.max(...weight, 0), secondary: completed.reduce((sum, set) => sum + (Number(set.weight) || 0) * (Number(set.reps) || 0), 0), sets: completed.length };
    });
    const latest = points.at(-1);
    return { id: name.toLowerCase().replace(/\s+/g, '-'), name, type: 'strength', metrics: [{ id: 'primary', label: 'Max Weight', unit: 'lbs' }, { id: 'secondary', label: 'Total Volume', unit: 'lbs' }], points, pr: { value: `${latest?.primary ?? 0} lbs`, caption: 'Latest logged session' }, oneRm: `${Math.round((latest?.primary ?? 0) * 1.1)} lbs` };
  }).filter((series) => series.points.length > 0);
}

export async function fetchWeeklyPlan() {
  const { supabase } = await userContext();
  const { data: templates, error } = await supabase.from('templates').select('id, name, type, target_day');
  if (error) throw new Error(error.message);
  const start = new Date(); start.setDate(start.getDate() - start.getDay()); start.setHours(0, 0, 0, 0);
  const { data: workouts, error: workoutError } = await supabase.from('workouts').select('template_id, logged_at').gte('logged_at', start.toISOString());
  if (workoutError) throw new Error(workoutError.message);
  return (templates ?? []).filter((template) => template.target_day !== null).map((template) => ({
    id: template.id, weekday: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][template.target_day ?? 0],
    dayNumber: new Date(start.getTime() + (template.target_day ?? 0) * 86400000).getDate(), title: template.name,
    focus: template.type === 'running' ? 'Running' : 'Strength', type: template.type,
    status: (workouts ?? []).some((workout) => workout.template_id === template.id) ? 'completed' as const : 'scheduled' as const,
    blocks: ['Template session'],
  }));
}

export async function signIn(email: string, password: string) {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message);
  revalidatePath('/');
}

export async function signUp(email: string, password: string) {
  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({ email, password });
  if (error) throw new Error(error.message);
  revalidatePath('/');
}
