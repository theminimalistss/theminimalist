import { useLayoutEffect, useRef } from 'react';
import { MOTION } from '@/constants/motion';
import {
  applyWheelImpulse,
  getCruiseVelocity,
  getSpiralPosition,
  normalizeWheelDelta,
  settleVelocity,
  wrapProgress,
} from '@/utils/spiral';

type Options = { count: number; paused: boolean; compact: boolean };

export function useSpiralLoop({ count, paused, compact }: Options) {
  const stageRef = useRef<HTMLDivElement>(null);
  const progress = useRef(0.5);
  const cruise = useRef(getCruiseVelocity(1));
  const velocity = useRef(getCruiseVelocity(1));

  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage || !count) return;
    const items = Array.from(stage.querySelectorAll<HTMLElement>('[data-spiral-item]'));
    let frame = 0;
    let lastTime = 0;
    let geometry = {
      width: stage.clientWidth,
      height: stage.clientHeight,
      cardWidth: items[0]?.offsetWidth ?? 320,
      compact,
    };

    const draw = () => {
      items.forEach((item, index) => {
        const position = getSpiralPosition(progress.current + index / count, geometry);
        item.style.transform = position.transform;
        item.style.zIndex = String(position.zIndex);
      });
    };
    const resize = new ResizeObserver(() => {
      geometry = {
        width: stage.clientWidth,
        height: stage.clientHeight,
        cardWidth: items[0]?.offsetWidth ?? 320,
        compact,
      };
      draw();
    });
    resize.observe(stage);
    draw();

    const focusWork = (event: FocusEvent) => {
      if (!(event.target instanceof HTMLElement) || !event.target.matches(':focus-visible')) return;
      const item = event.target.closest<HTMLElement>('[data-spiral-item]');
      const index = item ? items.indexOf(item) : -1;
      if (index < 0) return;
      progress.current = wrapProgress(0.5 - index / count);
      draw();
    };
    stage.addEventListener('focusin', focusWork);

    const steer = (event: WheelEvent) => {
      if (event.ctrlKey || !event.deltaY) return;
      const delta = normalizeWheelDelta(event.deltaY, event.deltaMode, window.innerHeight);
      cruise.current = getCruiseVelocity(delta > 0 ? 1 : -1);
      velocity.current = applyWheelImpulse(velocity.current, delta);
    };

    const animate = (time: number) => {
      const delta = lastTime ? Math.min(time - lastTime, MOTION.maxFrameDelta) : 0;
      lastTime = time;
      velocity.current = settleVelocity(velocity.current, cruise.current, delta);
      progress.current = wrapProgress(progress.current + velocity.current * delta);
      draw();
      frame = requestAnimationFrame(animate);
    };
    if (!paused) {
      frame = requestAnimationFrame(animate);
      window.addEventListener('wheel', steer, { passive: true });
    }

    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      stage.removeEventListener('focusin', focusWork);
      window.removeEventListener('wheel', steer);
      velocity.current = cruise.current;
    };
  }, [count, paused, compact]);

  return stageRef;
}
