import { useCallback, useState } from 'react';
import { summarizeTemplate, templateId } from '../utils/templates';
import type { WorkoutTemplate } from '../types/workout';
import { deleteTemplate as deleteTemplateAction, saveTemplate as saveTemplateAction } from '../actions';

export function useTemplates(initialTemplates: WorkoutTemplate[] = []) {
  const [templates, setTemplates] = useState<WorkoutTemplate[]>(initialTemplates);
  const [isSaving, setIsSaving] = useState(false);

  const saveTemplate = useCallback(async (template: WorkoutTemplate) => {
    const withSummary: WorkoutTemplate = { ...template, summary: summarizeTemplate(template) };
    setIsSaving(true);
    try {
      const savedId = await saveTemplateAction(withSummary);
      const saved = { ...withSummary, id: savedId };
      setTemplates((prev) =>
      prev.some((t) => t.id === template.id) ?
      prev.map((t) => t.id === template.id ? saved : t) :
      [...prev, saved]
      );
      return saved;
    } finally {
      setIsSaving(false);
    }
  }, []);

  const deleteTemplate = useCallback(async (id: string) => {
    await deleteTemplateAction(id);
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

  return { templates, saveTemplate, deleteTemplate, duplicateTemplate, isSaving };
}

export type TemplatesApi = ReturnType<typeof useTemplates>;