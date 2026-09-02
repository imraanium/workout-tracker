import { useCallback, useMemo, useRef, useState } from 'react';
import { previousBySet } from '../../data/exercises';
import type { ExerciseRow, SetRow, WorkoutDraft, WorkoutTemplate, WorkoutType } from '../../types/workout';

function makeIdFactory() {
  let n = 0;
  return () => {
    n += 1;
    return `row-${n}-${Math.random().toString(36).slice(2, 7)}`;
  };
}

function buildSets(name: string, count: number, nextId: () => string): SetRow[] {
  const previous = previousBySet[name] ?? [];
  return Array.from({ length: count }, (_, i) => ({
    id: nextId(),
    previous: previous[i] ?? null,
    weight: '',
    reps: '',
    done: false
  }));
}

const emptyExercise = (nextId: () => string): ExerciseRow => ({
  id: nextId(),
  name: '',
  targetReps: '3 × 8',
  sets: buildSets('', 3, nextId)
});

export function useWorkoutLogger() {
  const nextId = useRef(makeIdFactory()).current;
  const [draft, setDraft] = useState<WorkoutDraft>(() => ({
    name: 'Push Day A',
    type: 'strength',
    dateTime: '2026-09-02T18:30',
    exercises: [
    {
      id: nextId(),
      name: 'Bench Press',
      targetReps: '5 × 5',
      sets: buildSets('Bench Press', 4, nextId).map((s, i) =>
      i === 0 ? { ...s, weight: '190', reps: '5', done: true } : s
      )
    },
    {
      id: nextId(),
      name: 'Overhead Press',
      targetReps: '3 × 6',
      sets: buildSets('Overhead Press', 3, nextId)
    }]

  }));

  const patch = useCallback((next: Partial<WorkoutDraft>) => {
    setDraft((d) => ({ ...d, ...next }));
  }, []);

  const setName = useCallback((name: string) => patch({ name }), [patch]);
  const setType = useCallback((type: WorkoutType) => patch({ type }), [patch]);
  const setDateTime = useCallback((dateTime: string) => patch({ dateTime }), [patch]);

  const updateExercise = useCallback((id: string, next: Partial<ExerciseRow>) => {
    setDraft((d) => ({
      ...d,
      exercises: d.exercises.map((ex) => {
        if (ex.id !== id) return ex;
        const merged = { ...ex, ...next };
        if (next.name !== undefined && next.name !== ex.name) {
          const previous = previousBySet[next.name] ?? [];
          merged.sets = merged.sets.map((s, i) => ({ ...s, previous: previous[i] ?? null }));
        }
        return merged;
      })
    }));
  }, []);

  const removeExercise = useCallback((id: string) => {
    setDraft((d) => ({ ...d, exercises: d.exercises.filter((ex) => ex.id !== id) }));
  }, []);

  const addExercise = useCallback(() => {
    setDraft((d) => ({ ...d, exercises: [...d.exercises, emptyExercise(nextId)] }));
  }, [nextId]);

  const addSet = useCallback(
    (exerciseId: string) => {
      setDraft((d) => ({
        ...d,
        exercises: d.exercises.map((ex) =>
        ex.id === exerciseId ?
        {
          ...ex,
          sets: [
          ...ex.sets,
          {
            id: nextId(),
            previous: (previousBySet[ex.name] ?? [])[ex.sets.length] ?? null,
            weight: '',
            reps: '',
            done: false
          }]

        } :
        ex
        )
      }));
    },
    [nextId]
  );

  const removeSet = useCallback((exerciseId: string, setId: string) => {
    setDraft((d) => ({
      ...d,
      exercises: d.exercises.map((ex) =>
      ex.id === exerciseId ? { ...ex, sets: ex.sets.filter((s) => s.id !== setId) } : ex
      )
    }));
  }, []);

  const updateSet = useCallback((exerciseId: string, setId: string, next: Partial<SetRow>) => {
    setDraft((d) => ({
      ...d,
      exercises: d.exercises.map((ex) =>
      ex.id === exerciseId ?
      { ...ex, sets: ex.sets.map((s) => s.id === setId ? { ...s, ...next } : s) } :
      ex
      )
    }));
  }, []);

  const toggleSet = useCallback((exerciseId: string, setId: string) => {
    setDraft((d) => ({
      ...d,
      exercises: d.exercises.map((ex) =>
      ex.id === exerciseId ?
      {
        ...ex,
        sets: ex.sets.map((s) => {
          if (s.id !== setId) return s;
          if (s.done) return { ...s, done: false };
          const [prevWeight, prevReps] = (s.previous ?? '').split('×').map((v) => v.trim());
          return {
            ...s,
            done: true,
            weight: s.weight || prevWeight || '',
            reps: s.reps || prevReps || ''
          };
        })
      } :
      ex
      )
    }));
  }, []);

  const loadTemplate = useCallback(
    (template: WorkoutTemplate) => {
      setDraft((d) => ({
        ...d,
        name: template.name,
        type: template.type,
        exercises: template.exercises.map((ex) => ({
          id: nextId(),
          name: ex.name,
          targetReps: ex.targetReps,
          sets: buildSets(ex.name, ex.sets, nextId)
        }))
      }));
    },
    [nextId]
  );

  const stats = useMemo(() => {
    let completed = 0;
    let total = 0;
    let volume = 0;
    draft.exercises.forEach((ex) => {
      ex.sets.forEach((s) => {
        total += 1;
        if (s.done) {
          completed += 1;
          volume += (Number(s.weight) || 0) * (Number(s.reps) || 0);
        }
      });
    });
    return { completed, total, volume };
  }, [draft]);

  return {
    draft,
    stats,
    setName,
    setType,
    setDateTime,
    addExercise,
    updateExercise,
    removeExercise,
    addSet,
    removeSet,
    updateSet,
    toggleSet,
    loadTemplate
  };
}

export type WorkoutLoggerApi = ReturnType<typeof useWorkoutLogger>;