import type { CompletedWorkout } from '../types/workout';

export const recentWorkouts: CompletedWorkout[] = [
{
  id: 'w-1',
  name: 'Pull Day B',
  type: 'strength',
  date: 'Mon, Aug 31',
  relative: 'Yesterday',
  duration: '54 min',
  volume: 18420,
  sets: 12,
  detail: 'Barbell Row 165 × 8 — new working top set'
},
{
  id: 'w-2',
  name: 'Threshold Run',
  type: 'running',
  date: 'Sun, Aug 30',
  relative: '2 days ago',
  duration: '41 min',
  volume: 0,
  sets: 1,
  detail: '5.2 mi @ 7:48 /mi average'
},
{
  id: 'w-3',
  name: 'Leg Day',
  type: 'strength',
  date: 'Fri, Aug 28',
  relative: '4 days ago',
  duration: '1 hr 06 min',
  volume: 26150,
  sets: 15,
  detail: 'Back Squat 285 × 3 × 3 — held RPE 8'
},
{
  id: 'w-4',
  name: 'Push Day A',
  type: 'strength',
  date: 'Wed, Aug 26',
  relative: '6 days ago',
  duration: '58 min',
  volume: 21075,
  sets: 13,
  detail: 'Bench Press 190 × 4 — matched PR attempt'
},
{
  id: 'w-5',
  name: 'Easy Miles',
  type: 'running',
  date: 'Tue, Aug 25',
  relative: 'Last week',
  duration: '35 min',
  volume: 0,
  sets: 1,
  detail: '4.0 mi @ 8:42 /mi average'
}];


export const weekSummary = {
  sessions: 4,
  volume: 65645,
  sets: 41,
  streak: 6
};