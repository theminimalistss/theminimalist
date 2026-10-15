import { useEffect, useRef, useState } from 'react';
import { useAppEntered } from '@/hooks/useAppEntered';
import { usePageVisibility } from '@/hooks/usePageVisibility';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/** CSS owns the artwork; the hook owns playback and per-scene visibility. */
export function useServiceMotion(ready: boolean) {
  const ref = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotion();
  const visible = usePageVisibility();
  const entered = useAppEntered();
  useEffect(() => {
    const scenes = ref.current?.querySelectorAll('[data-service-scene]');
    if (!ready || !scenes) return;
    if (typeof IntersectionObserver !== 'function') {
      scenes.forEach((scene) => scene.setAttribute('data-scene-active', ''));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(({ target, isIntersecting }) => {
          target.toggleAttribute('data-scene-active', isIntersecting);
        });
      },
      { threshold: 0.1 },
    );
    scenes.forEach((scene) => observer.observe(scene));
    return () => observer.disconnect();
  }, [ready]);
  return {
    ref,
    paused,
    reduced,
    running: entered && visible && !reduced && !paused,
    toggle: () => setPaused((value) => !value),
  };
}
