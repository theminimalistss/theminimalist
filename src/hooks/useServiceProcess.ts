import { useEffect, useRef, useState } from 'react';
import { SERVICE_PROCESS } from '@/constants/pages';
import { SERVICE_PROCESS_MOTION } from '@/constants/motion';
import { useAppEntered } from '@/hooks/useAppEntered';
import { usePageVisibility } from '@/hooks/usePageVisibility';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export function useServiceProcess() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [inView, setInView] = useState(() => typeof IntersectionObserver !== 'function');
  const entered = useAppEntered();
  const visible = usePageVisibility();
  const reducedMotion = useReducedMotion();
  const running = entered && visible && inView && !reducedMotion && !hovered && !focused;
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    if (typeof IntersectionObserver !== 'function') return;
    const observer = new IntersectionObserver(([entry]) => setInView(!!entry?.isIntersecting), {
      threshold: 0.25,
    });
    observer.observe(root);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(
      () => setActive((value) => (value + 1) % SERVICE_PROCESS.length),
      SERVICE_PROCESS_MOTION.interval,
    );
    return () => window.clearTimeout(timer);
  }, [active, running]);
  return {
    ref,
    active,
    running,
    reducedMotion,
    animate: entered && visible && inView && !reducedMotion,
    choose: setActive,
    setFocused,
    setHovered,
  };
}
