import { useEffect, useRef } from 'react';
import { FOUNDER_SHOWCASE } from '@/constants/motion';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { usePageVisibility } from '@/hooks/usePageVisibility';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/** A stationary hit area keeps pointer input stable while its portrait tilts. */
export function useFounderDepth(active: boolean) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const finePointer = useMediaQuery('(hover: hover) and (pointer: fine)');
  const visible = usePageVisibility();

  useEffect(() => {
    const element = ref.current;
    if (!element || !active || reducedMotion || !finePointer || !visible) return;
    let frame = 0;
    let x = 0;
    let y = 0;
    let bounds: DOMRect | undefined;
    const apply = () => {
      frame = 0;
      element.style.setProperty('--portrait-x', `${(x * FOUNDER_SHOWCASE.travel).toFixed(2)}px`);
      element.style.setProperty('--portrait-y', `${(y * FOUNDER_SHOWCASE.travel).toFixed(2)}px`);
      element.style.setProperty('--portrait-rx', `${(-y * FOUNDER_SHOWCASE.tilt).toFixed(2)}deg`);
      element.style.setProperty('--portrait-ry', `${(x * FOUNDER_SHOWCASE.tilt).toFixed(2)}deg`);
    };
    const move = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      bounds ??= element.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      const normalize = (value: number) => Math.max(-1, Math.min(1, value * 2 - 1));
      x = normalize((event.clientX - bounds.left) / bounds.width);
      y = normalize((event.clientY - bounds.top) / bounds.height);
      element.dataset.depth = '';
      if (!frame) frame = requestAnimationFrame(apply);
    };
    const reset = () => {
      cancelAnimationFrame(frame);
      bounds = undefined;
      x = y = 0;
      delete element.dataset.depth;
      apply();
    };
    element.addEventListener('pointerenter', move);
    element.addEventListener('pointermove', move, { passive: true });
    element.addEventListener('pointerleave', reset);
    element.addEventListener('pointercancel', reset);
    window.addEventListener('resize', reset);
    window.addEventListener('scroll', reset, { passive: true });
    window.addEventListener('blur', reset);
    return () => {
      element.removeEventListener('pointerenter', move);
      element.removeEventListener('pointermove', move);
      element.removeEventListener('pointerleave', reset);
      element.removeEventListener('pointercancel', reset);
      window.removeEventListener('resize', reset);
      window.removeEventListener('scroll', reset);
      window.removeEventListener('blur', reset);
      reset();
    };
  }, [active, finePointer, reducedMotion, visible]);

  return ref;
}
