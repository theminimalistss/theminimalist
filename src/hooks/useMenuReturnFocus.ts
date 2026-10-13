import { useCallback, useEffect, useRef } from 'react';
import { focusMainContent } from '@/hooks/useRouteFocus';

export function useMenuReturnFocus(rendered: boolean) {
  const navigated = useRef(false);

  useEffect(() => {
    if (rendered || !navigated.current) return;
    navigated.current = false;
    focusMainContent();
  }, [rendered]);

  return useCallback(() => {
    navigated.current = true;
  }, []);
}
