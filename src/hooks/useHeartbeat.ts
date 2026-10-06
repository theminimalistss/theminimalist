import { useLayoutEffect, useRef } from 'react';
import { HEARTBEAT } from '@/constants/sounds';

export function useHeartbeat<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    const align = () => {
      if (document.hidden) return;
      element.style.setProperty('--beat-delay', `${-(performance.now() % HEARTBEAT.period)}ms`);
    };
    align();
    document.addEventListener('visibilitychange', align);
    return () => document.removeEventListener('visibilitychange', align);
  }, []);
  return ref;
}
