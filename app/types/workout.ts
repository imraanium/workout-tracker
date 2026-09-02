export type TabId = 'dashboard' | 'plan' | 'templates' | 'progression';

export type WorkoutType = 'strength' | 'running';

export interface SetRow {
  id: string;
  previous: string | null;
  weight: string;
  reps: string;
  done: boolean;
}

export interface ExerciseRow {
  id: string;
  name: string;
  targetReps: string;
  sets: SetRow[];
}

export interface WorkoutDraft {
  name: string;
  type: WorkoutType;
  dateTime: string;
  exercises: ExerciseRow[];
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  type: WorkoutType;
  summary: string;
  exercises: {
    name: string;
    targetReps: string;
    sets: number;
  }[];
}

export interface CompletedWorkout {
  id: string;
  name: string;
  type: WorkoutType;
  date: string;
  relative: string;
  duration: string;
  volume: number;
  sets: number;
  detail: string;
}

export type PlanStatus = 'completed' | 'scheduled' | 'rest';

export interface PlanDay {
  id: string;
  weekday: string;
  dayNumber: number;
  title: string;
  focus: string;
  status: PlanStatus;
  type?: WorkoutType;
  blocks: string[];
}

export interface WarmUpItem {
  name: string;
  description: string;
  duration: string;
}

export interface WarmUpGroup {
  id: string;
  title: string;
  note: string;
  items: WarmUpItem[];
}

export interface ProgressPoint {
  date: string;
  primary: number;
  secondary: number;
  sets: number;
}

export interface ProgressMetric {
  id: 'primary' | 'secondary';
  label: string;
  unit: string;
  invert?: boolean;
}

export interface ProgressSeries {
  id: string;
  name: string;
  type: WorkoutType;
  metrics: ProgressMetric[];
  points: ProgressPoint[];
  pr: {value: string;caption: string;};
  oneRm: string;
}

export type Timeframe = '1M' | '3M' | '6M' | '1Y' | 'ALL';