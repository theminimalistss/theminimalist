import { useState } from 'react';
import { useTemplates } from '@/hooks/useTemplates';
import { filterTemplates } from '@/services/templates.service';

export function useTemplateCatalog() {
  const state = useTemplates();
  const [category, chooseCategory] = useState<string | null>(null);
  const templates = state.status === 'ready' ? state.templates : [];
  return {
    state,
    category,
    chooseCategory,
    templates,
    categories: state.status === 'ready' ? state.categories : [],
    shown: filterTemplates(templates, category),
  };
}
