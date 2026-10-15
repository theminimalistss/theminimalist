import { useLayoutEffect, useRef, useState } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cssTimeMs } from '@/utils/cssTime';

/** Paired cards share one drawer, so expanded content cannot leave grid holes. */
export function useBrandDisclosure(count: number) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const [choices, setChoices] = useState(() =>
    Array.from({ length: Math.ceil(count / 2) }, (_, row) => row * 2),
  );
  const reduced = useReducedMotion();
  const animations = useRef(new Map<HTMLElement, Animation>());
  const heights = useRef(new Map<HTMLElement, number>());

  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    let frame = 0;
    const panels = Array.from(root.querySelectorAll<HTMLElement>('[data-brand-drawer]'));
    const tokens = getComputedStyle(root);
    const duration = cssTimeMs(tokens.getPropertyValue('--duration-reveal'), 600);
    const easing = tokens.getPropertyValue('--ease-editorial').trim() || 'ease';
    const update = () => {
      frame = 0;
      panels.forEach((panel) => {
        const content = panel.firstElementChild as HTMLElement;
        const open = panel.hasAttribute('data-open');
        const to = open ? content.getBoundingClientRect().height : 0;
        const previous = animations.current.get(panel);
        if (previous && !reduced && Math.abs((heights.current.get(panel) ?? 0) - to) < 1) return;
        const from = previous
          ? panel.getBoundingClientRect().height
          : (heights.current.get(panel) ?? 0);
        previous?.cancel();
        animations.current.delete(panel);
        panel.style.height = open ? 'auto' : '0px';
        heights.current.set(panel, to);
        if (reduced || typeof panel.animate !== 'function' || Math.abs(from - to) < 1) return;
        const animation = panel.animate([{ height: `${from}px` }, { height: `${to}px` }], {
          duration,
          easing,
        });
        animations.current.set(panel, animation);
        void animation.finished.then(
          () => {
            if (animations.current.get(panel) === animation) animations.current.delete(panel);
          },
          () => undefined,
        );
      });
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    const resize = typeof ResizeObserver === 'function' ? new ResizeObserver(schedule) : null;
    panels.forEach((panel) => resize?.observe(panel.firstElementChild!));
    window.addEventListener('resize', schedule, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      resize?.disconnect();
      window.removeEventListener('resize', schedule);
    };
  }, [active, choices, reduced]);

  useLayoutEffect(() => {
    const running = animations.current;
    return () => running.forEach((animation) => animation.cancel());
  }, []);

  const choose = (index: number) => {
    setChoices((values) =>
      values.map((value, row) => (row === Math.floor(index / 2) ? index : value)),
    );
    setActive((current) => (current === index ? null : index));
  };
  return { ref, active, choices, choose };
}
