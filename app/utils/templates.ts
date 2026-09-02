import type { WorkoutTemplate } from '../types/workout';

export function summarizeTemplate(template: Omit<WorkoutTemplate, 'summary' | 'id'>): string {
  if (template.type === 'running') {
    const target = template.exercises[0]?.targetReps;
    return target ? `${target} · endurance` : 'Endurance session';
  }
  const totalSets = template.exercises.reduce((sum, ex) => sum + ex.sets, 0);
  const count = template.exercises.length;
  return `${count} exercise${count === 1 ? '' : 's'} · ${totalSets} sets`;
}

export function templateId(name: string): string {
  const slug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return `${slug || 'template'}-${Math.random().toString(36).slice(2, 6)}`;
}