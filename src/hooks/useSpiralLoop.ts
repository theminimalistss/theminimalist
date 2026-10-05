import { useLayoutEffect, useRef, type RefObject } from 'react';
import { soundEngine } from '@/audio/soundEngine';
import { MOTION } from '@/constants/motion';
import {
  applyWheelImpulse,
  getCruiseVelocity,
  getSpiralPosition,
  normalizeWheelDelta,
  settleVelocity,
  wrapProgress,
} from '@/utils/spiral';

type Options = {
  count: number;
  paused: boolean;
  compact: boolean;
  enabled: boolean;
  keyboard: RefObject<boolean>;
};

export function useSpiralLoop({ count, paused, compact, enabled, keyboard }: Options) {
  const stageRef = useRef<HTMLOListElement>(null);
  const progress = useRef(0.5);
  const cruise = useRef(getCruiseVelocity(1));
  const velocity = useRef(getCruiseVelocity(1));

  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage || !count || !enabled) return;
    const items = Array.from(stage.querySelectorAll<HTMLElement>('[data-spiral-item]'));
    let frame = 0;
    let lastTime = 0;
    let lastSlot = Math.floor(progress.current * count);
    let hovering = false;
    const hover = (event: PointerEvent) => {
      hovering =
        event.pointerType === 'mouse' &&
        event.target instanceof Element &&
        event.target.closest('[data-spiral-item]') !== null;
    };
    const leave = () => {
      hovering = false;
    };
    let geometry = {
      width: stage.clientWidth,
      height: stage.clientHeight,
      cardWidth: items[0]?.offsetWidth ?? 320,
      compact,
    };

    const draw = () => {
      items.forEach((item, index) => {
        const position = getSpiralPosition(progress.current + index / count, geometry);
        const zIndex = String(position.zIndex);
        item.style.transform = position.transform;
        if (item.style.zIndex !== zIndex) item.style.zIndex = zIndex;
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
      if (!(event.target instanceof HTMLElement) || !keyboard.current) return;
      const item = event.target.closest<HTMLElement>('[data-spiral-item]');
      const index = item ? items.indexOf(item) : -1;
      if (index < 0) return;
      progress.current = wrapProgress(0.5 - index / count);
      draw();
    };
    stage.addEventListener('focusin', focusWork);
    stage.addEventListener('pointerover', hover);
    stage.addEventListener('pointerleave', leave);

    const steer = (event: WheelEvent) => {
      if (event.ctrlKey || !event.deltaY) return;
      const delta = normalizeWheelDelta(event.deltaY, event.deltaMode, window.innerHeight);
      cruise.current = getCruiseVelocity(delta > 0 ? 1 : -1);
      velocity.current = applyWheelImpulse(velocity.current, delta);
      soundEngine.whoosh(Math.abs(delta) / MOTION.wheelSoundRange);
    };

    const animate = (time: number) => {
      const delta = lastTime ? Math.min(time - lastTime, MOTION.maxFrameDelta) : 0;
      lastTime = time;
      const target = cruise.current * (hovering ? MOTION.hoverCruise : 1);
      velocity.current = settleVelocity(velocity.current, target, delta);
      progress.current = wrapProgress(progress.current + velocity.current * delta);
      const slot = Math.floor(progress.current * count);
      if (slot !== lastSlot) {
        lastSlot = slot;
        if (Math.abs(velocity.current) > Math.abs(cruise.current) * MOTION.detentSpeed) {
          soundEngine.play('detent');
        }
      }
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
      stage.removeEventListener('pointerover', hover);
      stage.removeEventListener('pointerleave', leave);
      window.removeEventListener('wheel', steer);
      velocity.current = cruise.current;
      items.forEach((item) => {
        item.style.transform = '';
        item.style.zIndex = '';
      });
    };
  }, [count, paused, compact, enabled, keyboard]);

  return stageRef;
}
