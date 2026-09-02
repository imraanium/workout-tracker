import { useCallback, useState } from 'react';
import { workoutTemplates } from '../data/exercises';
import { summarizeTemplate, templateId } from '../utils/templates';
import type { WorkoutTemplate } from '../types/workout';

export function useTemplates() {
  const [templates, setTemplates] = useState<WorkoutTemplate[]>(workoutTemplates);

  const saveTemplate = useCallback((template: WorkoutTemplate) => {
    const withSummary: WorkoutTemplate = { ...template, summary: summarizeTemplate(template) };
    setTemplates((prev) =>
    prev.some((t) => t.id === withSummary.id) ?
    prev.map((t) => t.id === withSummary.id ? withSummary : t) :
    [...prev, withSummary]
    );
    return withSummary;
  }, []);

  const deleteTemplate = useCallback((id: string) => {
    setTemplates((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const duplicateTemplate = useCallback((id: string) => {
    let created: WorkoutTemplate | null = null;
    setTemplates((prev) => {
      const source = prev.find((t) => t.id === id);
      if (!source) return prev;
      created = { ...source, id: templateId(source.name), name: `${source.name} (Copy)` };
      return [...prev, created];
    });
    return created;
  }, []);

  return { templates, saveTemplate, deleteTemplate, duplicateTemplate };
}

export type TemplatesApi = ReturnType<typeof useTemplates>;