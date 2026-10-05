import { useEffect, useRef } from 'react';

export const MAIN_CONTENT_ID = 'main-content';

export function focusMainContent() {
  document.getElementById(MAIN_CONTENT_ID)?.focus({ preventScroll: true });
}

export function useRouteFocus(pathname: string) {
  const previous = useRef(pathname);

  useEffect(() => {
    if (previous.current === pathname) return;
    previous.current = pathname;
    window.scrollTo({ top: 0 });
    focusMainContent();
  }, [pathname]);
}
