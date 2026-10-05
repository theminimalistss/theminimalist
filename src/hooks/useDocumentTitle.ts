import { useEffect } from 'react';

const SITE_TITLE = 'The Minimalist — Independent Design Studio';

export function useDocumentTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} — The Minimalist` : SITE_TITLE;
  }, [title]);
}
