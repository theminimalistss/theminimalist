import { useLayoutEffect, useRef } from 'react';
import { COLLECTION_MORPH } from '@/constants/motion';
import { getChromeKeyframes, needsChromeMove } from '@/utils/collectionMorph';

const JUMP = 16;

export function useLayoutGlide<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useLayoutEffect(() => {
    const root = ref.current;
    if (!root || typeof ResizeObserver !== 'function') return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const read = () =>
      new Map(
        Array.from(root.querySelectorAll<HTMLElement>('[data-glide]'), (element) => [
          element,
          element.getBoundingClientRect(),
        ]),
      );
    let boxes = read();
    let view = { width: window.innerWidth, height: window.innerHeight };
    const observer = new ResizeObserver(() => {
      const next = { width: window.innerWidth, height: window.innerHeight };
      const resized = Math.hypot(next.width - view.width, next.height - view.height);
      if (resized > 0 && !reduced.matches) {
        read().forEach((box, element) => {
          const previous = boxes.get(element);
          if (!previous || !box.width || !element.animate) return;
          const moved = Math.hypot(previous.left - box.left, previous.top - box.top);
          const resizedBox = Math.abs(previous.width - box.width) > resized + JUMP;
          if ((moved > resized + JUMP || resizedBox) && needsChromeMove(previous, box)) {
            element.animate(getChromeKeyframes(previous, box, 1), {
              duration: COLLECTION_MORPH.duration,
              easing: COLLECTION_MORPH.easing,
            });
          }
        });
      }
      view = next;
      boxes = read();
    });
    observer.observe(root);
    return () => observer.disconnect();
  }, []);
  return ref;
}
