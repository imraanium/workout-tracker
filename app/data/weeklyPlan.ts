import type { PlanDay } from '../types/workout';

export const weeklyPlan: PlanDay[] = [
{
  id: 'mon',
  weekday: 'Mon',
  dayNumber: 31,
  title: 'Leg Day',
  focus: 'Squat · posterior chain',
  status: 'completed',
  type: 'strength',
  blocks: ['Back Squat 5 × 5', 'Romanian Deadlift 3 × 8', 'Walking Lunge 2 × 12']
},
{
  id: 'tue',
  weekday: 'Tue',
  dayNumber: 1,
  title: 'Push Day A',
  focus: 'Bench · overhead press',
  status: 'completed',
  type: 'strength',
  blocks: ['Bench Press 5 × 5', 'Overhead Press 3 × 6', 'Face Pull 3 × 15']
},
{
  id: 'wed',
  weekday: 'Wed',
  dayNumber: 2,
  title: 'Threshold Run',
  focus: '5 mi @ 7:45 /mi',
  status: 'scheduled',
  type: 'running',
  blocks: ['1 mi warm-up', '3 mi threshold', '1 mi cool-down']
},
{
  id: 'thu',
  weekday: 'Thu',
  dayNumber: 3,
  title: 'Pull Day B',
  focus: 'Row · vertical pull',
  status: 'scheduled',
  type: 'strength',
  blocks: ['Barbell Row 4 × 8', 'Lat Pulldown 3 × 10', 'Hanging Leg Raise 3 × 12']
},
{
  id: 'fri',
  weekday: 'Fri',
  dayNumber: 4,
  title: 'Rest Day',
  focus: 'Mobility only',
  status: 'rest',
  blocks: ['Hip flow 10 min', 'Foam roll quads + lats']
},
{
  id: 'sat',
  weekday: 'Sat',
  dayNumber: 5,
  title: 'Long Run',
  focus: '8 mi easy',
  status: 'scheduled',
  type: 'running',
  blocks: ['8 mi conversational', 'Strides × 4']
},
{
  id: 'sun',
  weekday: 'Sun',
  dayNumber: 6,
  title: 'Rest Day',
  focus: 'Full recovery',
  status: 'rest',
  blocks: ['Walk 30 min', 'Sleep target 8 hr']
}];