import { useEffect, useRef, useState } from 'react';

type Cue = { label: string; visible: boolean };

const FOLLOW_EASE = 0.18;

export function usePointerCue<T extends HTMLElement>(enabled: boolean, eased: boolean) {
  const areaRef = useRef<T>(null);
  const cueRef = useRef<HTMLSpanElement>(null);
  const [cue, setCue] = useState<Cue>({ label: '', visible: false });

  useEffect(() => {
    const area = areaRef.current;
    const element = cueRef.current;
    if (!area || !element || !enabled) return;
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let frame = 0;
    let placed = false;

    const render = () => {
      const ease = eased ? FOLLOW_EASE : 1;
      current.x += (target.x - current.x) * ease;
      current.y += (target.y - current.y) * ease;
      element.style.transform = `translate3d(${current.x.toFixed(1)}px, ${current.y.toFixed(1)}px, 0)`;
      const settled = Math.abs(target.x - current.x) < 0.2 && Math.abs(target.y - current.y) < 0.2;
      frame = settled ? 0 : requestAnimationFrame(render);
    };

    const move = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      const bounds = area.getBoundingClientRect();
      target.x = event.clientX - bounds.left;
      target.y = event.clientY - bounds.top;
      if (!placed) {
        current.x = target.x;
        current.y = target.y;
        placed = true;
      }
      const owner =
        event.target instanceof Element ? event.target.closest<HTMLElement>('[data-cue]') : null;
      const label = owner?.dataset.cue;
      setCue((previous) =>
        label
          ? previous.visible && previous.label === label
            ? previous
            : { label, visible: true }
          : previous.visible
            ? { ...previous, visible: false }
            : previous,
      );
      if (!frame) frame = requestAnimationFrame(render);
    };

    const leave = () => {
      placed = false;
      setCue((previous) => (previous.visible ? { ...previous, visible: false } : previous));
    };

    area.addEventListener('pointermove', move);
    area.addEventListener('pointerleave', leave);
    return () => {
      cancelAnimationFrame(frame);
      area.removeEventListener('pointermove', move);
      area.removeEventListener('pointerleave', leave);
    };
  }, [enabled, eased]);

  return { areaRef, cueRef, cue };
}
