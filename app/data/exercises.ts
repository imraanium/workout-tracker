import type { WorkoutTemplate } from '../types/workout';

export const exerciseLibrary = [
'Back Squat',
'Barbell Row',
'Bench Press',
'Bulgarian Split Squat',
'Deadlift',
'Face Pull',
'Front Squat',
'Hanging Leg Raise',
'Incline Dumbbell Press',
'Lat Pulldown',
'Leg Press',
'Overhead Press',
'Pull-Up',
'Romanian Deadlift',
'Seated Cable Row',
'Tempo Run',
'Walking Lunge'];


/** Last session's best-known numbers, shown as ghost text in the set grid. */
export const previousBySet: Record<string, string[]> = {
  'Bench Press': ['185 × 5', '185 × 5', '190 × 4', '190 × 3'],
  'Back Squat': ['275 × 5', '275 × 5', '285 × 3', '285 × 3'],
  'Barbell Row': ['155 × 8', '155 × 8', '160 × 6'],
  Deadlift: ['315 × 3', '325 × 3', '335 × 2'],
  'Overhead Press': ['115 × 6', '115 × 5', '120 × 4'],
  'Romanian Deadlift': ['205 × 8', '205 × 8', '215 × 6'],
  'Lat Pulldown': ['130 × 10', '140 × 8', '140 × 8'],
  'Incline Dumbbell Press': ['70 × 10', '75 × 8', '75 × 8'],
  'Walking Lunge': ['50 × 12', '50 × 12'],
  'Face Pull': ['45 × 15', '45 × 15', '50 × 12']
};

export const workoutTemplates: WorkoutTemplate[] = [
{
  id: 'push-a',
  name: 'Push Day A',
  type: 'strength',
  summary: 'Bench focus · 4 exercises',
  exercises: [
  { name: 'Bench Press', targetReps: '5 × 5', sets: 4 },
  { name: 'Overhead Press', targetReps: '3 × 6', sets: 3 },
  { name: 'Incline Dumbbell Press', targetReps: '3 × 10', sets: 3 },
  { name: 'Face Pull', targetReps: '3 × 15', sets: 3 }]

},
{
  id: 'leg-day',
  name: 'Leg Day',
  type: 'strength',
  summary: 'Squat focus · 3 exercises',
  exercises: [
  { name: 'Back Squat', targetReps: '5 × 5', sets: 4 },
  { name: 'Romanian Deadlift', targetReps: '3 × 8', sets: 3 },
  { name: 'Walking Lunge', targetReps: '2 × 12', sets: 2 }]

},
{
  id: 'pull-b',
  name: 'Pull Day B',
  type: 'strength',
  summary: 'Row focus · 3 exercises',
  exercises: [
  { name: 'Barbell Row', targetReps: '4 × 8', sets: 3 },
  { name: 'Lat Pulldown', targetReps: '3 × 10', sets: 3 },
  { name: 'Hanging Leg Raise', targetReps: '3 × 12', sets: 3 }]

},
{
  id: 'tempo-run',
  name: 'Tempo Run',
  type: 'running',
  summary: '5 mi · threshold pace',
  exercises: [{ name: 'Tempo Run', targetReps: '5 mi', sets: 1 }]
}];