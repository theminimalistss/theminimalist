import { useEffect, useRef, useState } from 'react';
import { useAppEntered } from '@/hooks/useAppEntered';
import { usePageVisibility } from '@/hooks/usePageVisibility';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/** Shared native illustration playback; browser lifecycle stays outside UI. */
export function useIllustrationMotion(ready: boolean, selector: string) {
  const ref = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotion();
  const visible = usePageVisibility();
  const entered = useAppEntered();
  useEffect(() => {
    const scenes = ref.current?.querySelectorAll(selector);
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
  }, [ready, selector]);
  return {
    ref,
    paused,
    reduced,
    running: entered && visible && !reduced && !paused,
    toggle: () => setPaused((value) => !value),
  };
}
