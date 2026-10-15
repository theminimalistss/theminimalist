import { useLayoutEffect, useRef, useState } from 'react';
import { contactSurface, type ContactSurface } from '@/services/contactContrast.service';
import { usePageVisibility } from '@/hooks/usePageVisibility';

export function useContactContrast(route: string, enabled: boolean) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [surface, setSurface] = useState<ContactSurface>('light');
  const visible = usePageVisibility();
  useLayoutEffect(() => {
    const button = ref.current;
    if (!button || !enabled || !visible || typeof document.elementsFromPoint !== 'function') return;
    let frame = 0;
    const measure = () => {
      frame = 0;
      const box = button.getBoundingClientRect();
      if (!box.width || !box.height) return;
      const under = document
        .elementsFromPoint(box.x + box.width / 2, box.y + box.height / 2)
        .find((element) => !button.contains(element));
      const backgrounds: string[] = [];
      for (let element = under; element; element = element.parentElement ?? undefined) {
        const value = getComputedStyle(element).backgroundColor;
        if (value !== 'transparent' && value !== 'rgba(0, 0, 0, 0)') backgrounds.push(value);
      }
      const tokens = getComputedStyle(document.documentElement);
      setSurface(
        contactSurface(backgrounds, {
          light: tokens.getPropertyValue('--color-canvas').trim(),
          dark: tokens.getPropertyValue('--color-brand').trim(),
        }),
      );
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener('scroll', schedule, { capture: true, passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    document.addEventListener('transitionend', schedule, true);
    const mutations = new MutationObserver(schedule);
    mutations.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'data-open'],
    });
    const resize = typeof ResizeObserver === 'function' ? new ResizeObserver(schedule) : null;
    resize?.observe(button);
    resize?.observe(document.documentElement);
    return () => {
      cancelAnimationFrame(frame);
      mutations.disconnect();
      resize?.disconnect();
      window.removeEventListener('scroll', schedule, true);
      window.removeEventListener('resize', schedule);
      document.removeEventListener('transitionend', schedule, true);
    };
  }, [route, enabled, visible]);
  return { ref, surface };
}
