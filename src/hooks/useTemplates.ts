import { useEffect, useState } from 'react';
import { getTemplates, templateCategories } from '@/services/templates.service';
import type { WebsiteTemplate } from '@/types/template';

type State =
  | { status: 'loading' }
  | { status: 'ready'; templates: WebsiteTemplate[]; categories: string[] }
  | { status: 'error'; message: string };

export function useTemplates() {
  const [state, setState] = useState<State>({ status: 'loading' });
  useEffect(() => {
    const controller = new AbortController();
    void getTemplates(undefined, controller.signal).then(
      (templates) => {
        if (!controller.signal.aborted)
          setState({ status: 'ready', templates, categories: templateCategories(templates) });
      },
      () => {
        if (!controller.signal.aborted)
          setState({ status: 'error', message: 'Templates couldn’t be loaded. Please try again.' });
      },
    );
    return () => controller.abort();
  }, []);
  return state;
}
