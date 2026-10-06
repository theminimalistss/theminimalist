import { useEffect, useLayoutEffect, useRef, type RefObject } from 'react';
import { soundEngine } from '@/audio/soundEngine';
import { MOTION } from '@/constants/motion';
import { clamp01, easeInOutCubic } from '@/utils/easing';
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
  frozen: boolean;
  compact: boolean;
  enabled: boolean;
  keyboard: RefObject<boolean>;
};

export function useSpiralLoop({ count, paused, frozen, compact, enabled, keyboard }: Options) {
  const stageRef = useRef<HTMLOListElement>(null);
  const progress = useRef(0.5);
  const cruise = useRef(getCruiseVelocity(1));
  const velocity = useRef(getCruiseVelocity(1));
  const pausedRef = useRef(paused);
  const frozenRef = useRef(frozen);
  const wakeRef = useRef<() => void>(() => undefined);

  useEffect(() => {
    pausedRef.current = paused;
    frozenRef.current = frozen;
    wakeRef.current();
  }, [paused, frozen]);

  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage || !count || !enabled) return;
    const items = Array.from(stage.querySelectorAll<HTMLElement>('[data-spiral-item]'));
    let frame = 0;
    let lastTime = 0;
    let motion = pausedRef.current || frozenRef.current ? 0 : 1;
    let goal = motion;
    let from = motion;
    let elapsed = 0;
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
      if (event.ctrlKey || !event.deltaY || pausedRef.current || frozenRef.current) return;
      const delta = normalizeWheelDelta(event.deltaY, event.deltaMode, window.innerHeight);
      cruise.current = getCruiseVelocity(delta > 0 ? 1 : -1);
      velocity.current = applyWheelImpulse(velocity.current, delta);
      soundEngine.whoosh(Math.abs(delta) / MOTION.wheelSoundRange);
    };

    const animate = (time: number) => {
      const delta = lastTime ? Math.min(time - lastTime, MOTION.maxFrameDelta) : 0;
      lastTime = time;
      const resting = pausedRef.current || frozenRef.current;
      const nextGoal = resting ? 0 : 1;
      if (nextGoal !== goal) {
        goal = nextGoal;
        from = motion;
        elapsed = 0;
      }
      elapsed += delta;
      const eased = easeInOutCubic(clamp01(elapsed / MOTION.motionDuration));
      motion = frozenRef.current ? 0 : from + (goal - from) * eased;
      const target = cruise.current * (hovering ? MOTION.hoverCruise : 1);
      velocity.current = settleVelocity(velocity.current, target, delta);
      progress.current = wrapProgress(progress.current + velocity.current * delta * motion);
      const slot = Math.floor(progress.current * count);
      if (slot !== lastSlot) {
        lastSlot = slot;
        if (Math.abs(velocity.current * motion) > Math.abs(cruise.current) * MOTION.detentSpeed) {
          soundEngine.play('detent');
        }
      }
      draw();
      if (resting && (frozenRef.current || elapsed >= MOTION.motionDuration)) {
        motion = 0;
        frame = 0;
        lastTime = 0;
        return;
      }
      frame = requestAnimationFrame(animate);
    };
    const wake = () => {
      if (frame || (pausedRef.current && motion === 0) || frozenRef.current) return;
      frame = requestAnimationFrame(animate);
    };
    wakeRef.current = wake;
    wake();
    window.addEventListener('wheel', steer, { passive: true });

    return () => {
      wakeRef.current = () => undefined;
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
  }, [count, compact, enabled, keyboard]);

  return stageRef;
}
