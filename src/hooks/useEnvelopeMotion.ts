import { useLayoutEffect, useRef } from 'react';
import type { InquiryKind } from '@/types/inquiry';

/** Native SVG attributes repaint reliably during inquiry changes in Safari. */
export function useEnvelopeMotion(kind: InquiryKind, enabled: boolean) {
  const ref = useRef<SVGSVGElement>(null);
  const previous = useRef(kind);

  useLayoutEffect(() => {
    const svg = ref.current;
    const stamp = svg?.querySelector<SVGGElement>('[data-envelope-stamp]');
    const response = svg?.querySelector<SVGGElement>('[data-envelope-response]');
    const changed = previous.current !== kind;
    previous.current = kind;
    if (!svg || !stamp || !response || !enabled || !changed) return;
    let frame = 0;
    let painted = 0;
    const started = performance.now();
    const reset = () => {
      stamp.removeAttribute('transform');
      stamp.removeAttribute('opacity');
      response.removeAttribute('transform');
      delete svg.dataset.changing;
    };
    const tick = (time: number) => {
      frame = 0;
      const progress = Math.min(1, (time - started) / 600);
      if (progress >= 1) {
        reset();
        return;
      }
      if (!painted || time - painted >= 1_000 / 30) {
        painted = time;
        const spring = Math.exp(-7 * progress) * Math.cos(10 * progress);
        stamp.setAttribute('transform', `rotate(${-10 * spring}) scale(${1 + 0.35 * spring})`);
        stamp.setAttribute('opacity', String(Math.min(1, 0.2 + progress * 5)));
        response.setAttribute(
          'transform',
          `translate(80 76) rotate(${-3 * spring}) translate(-80 -76)`,
        );
      }
      frame = requestAnimationFrame(tick);
    };
    svg.dataset.changing = '';
    tick(started);
    return () => {
      cancelAnimationFrame(frame);
      reset();
    };
  }, [kind, enabled]);

  return ref;
}
