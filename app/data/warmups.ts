import type { WarmUpGroup } from '../types/workout';

export const warmUpGroups: WarmUpGroup[] = [
{
  id: 'dynamic',
  title: 'Dynamic Stretches',
  note: 'Run before every strength session',
  items: [
  {
    name: 'Leg Swings',
    description: 'Front-to-back then lateral, holding a rack for balance. Keep the torso quiet.',
    duration: '10 each side'
  },
  {
    name: 'World\u2019s Greatest Stretch',
    description: 'Deep lunge, elbow to instep, then rotate the top arm to the ceiling.',
    duration: '5 each side'
  },
  {
    name: 'Inchworm to Push-Up',
    description: 'Walk the hands out to a plank, one push-up, then walk the feet in.',
    duration: '8 reps'
  }]

},
{
  id: 'upper',
  title: 'Upper Body Mobility',
  note: 'Press and pull days',
  items: [
  {
    name: 'Band Pull-Apart',
    description: 'Light band at chest height, squeeze the shoulder blades, no shrug.',
    duration: '2 × 15'
  },
  {
    name: 'Wall Slides',
    description: 'Forearms on the wall, slide overhead while keeping the low back flat.',
    duration: '12 reps'
  },
  {
    name: 'Thoracic Extension',
    description: 'Foam roller under the mid-back, extend over it for 3 slow breaths.',
    duration: '90 sec'
  }]

},
{
  id: 'lower',
  title: 'Lower Body Mobility',
  note: 'Squat and deadlift days',
  items: [
  {
    name: 'Goblet Squat Hold',
    description: 'Light bell at the chest, sit into the bottom and pry the knees out.',
    duration: '45 sec'
  },
  {
    name: '90/90 Hip Switch',
    description: 'Seated hip rotations, driving the knees down without hands.',
    duration: '10 switches'
  },
  {
    name: 'Ankle Rock',
    description: 'Half-kneeling, drive the knee past the toes with the heel planted.',
    duration: '10 each side'
  }]

},
{
  id: 'cardio',
  title: 'Light Cardio',
  note: 'Raise core temperature first',
  items: [
  {
    name: 'Rower',
    description: 'Easy pace, damper 4, build stroke rate over the last minute.',
    duration: '5 min'
  },
  {
    name: 'Incline Walk',
    description: '8% grade at 3.0 mph. Nasal breathing only.',
    duration: '6 min'
  },
  {
    name: 'Jump Rope',
    description: 'Single unders, soft knees, stay on the balls of the feet.',
    duration: '3 × 60 sec'
  }]

}];