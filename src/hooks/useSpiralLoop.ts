import { useEffect, useLayoutEffect, useRef, type RefObject } from 'react';
import { soundEngine } from '@/audio/soundEngine';
import { COLLECTION_MORPH, COMPACT_QUERY, MOTION } from '@/constants/motion';
import { getClipInset, type Region } from '@/utils/collectionMorph';
import { clamp01, easeInOutCubic } from '@/utils/easing';
import {
  applyWheelImpulse,
  getCruiseVelocity,
  getSpiralBlend,
  getSpiralPosition,
  normalizeWheelDelta,
  settleVelocity,
  wrapProgress,
  type SpiralLayout,
} from '@/utils/spiral';

type Options = {
  count: number;
  paused: boolean;
  frozen: boolean;
  enabled: boolean;
  keyboard: RefObject<boolean>;
};

type Reshape = { from: SpiralLayout; elapsed: number; clip: Animation | null };

export function useSpiralLoop({ count, paused, frozen, enabled, keyboard }: Options) {
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
    const viewport = stage.parentElement;
    const compactQuery = window.matchMedia(COMPACT_QUERY);
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
    const measure = (): SpiralLayout => {
      const rect = stage.getBoundingClientRect();
      return {
        width: stage.clientWidth,
        height: stage.clientHeight,
        cardWidth: items[0]?.offsetWidth ?? 320,
        compact: compactQuery.matches,
        centerX: rect.left + rect.width / 2 + window.scrollX,
        centerY: rect.top + rect.height / 2 + window.scrollY,
      };
    };
    const clipRegion = (): Region | null => viewport?.getBoundingClientRect() ?? null;
    let layout = measure();
    let clip = clipRegion();
    let reshape: Reshape | null = null;

    const draw = () => {
      const amount = reshape
        ? easeInOutCubic(clamp01(reshape.elapsed / COLLECTION_MORPH.duration))
        : 1;
      items.forEach((item, index) => {
        const at = progress.current + index / count;
        const position = reshape
          ? getSpiralBlend(at, reshape.from, layout, amount)
          : getSpiralPosition(at, layout);
        const zIndex = String(position.zIndex);
        item.style.transform = position.transform;
        if (item.style.zIndex !== zIndex) item.style.zIndex = zIndex;
      });
    };
    const endReshape = () => {
      reshape?.clip?.cancel();
      reshape = null;
      if (viewport) delete viewport.dataset.reshaping;
    };
    // Crossing the mobile breakpoint blends between the two spiral shapes instead of snapping.
    const relayout = () => {
      const next = measure();
      const nextClip = clipRegion();
      const crossed = next.compact !== layout.compact;
      if (crossed && !frozenRef.current && viewport?.animate && clip && nextClip) {
        const elapsed = reshape ? Math.max(0, COLLECTION_MORPH.duration - reshape.elapsed) : 0;
        reshape?.clip?.cancel();
        viewport.dataset.reshaping = '';
        const clipAnimation = viewport.animate(
          [
            { clipPath: getClipInset(nextClip, clip) },
            { clipPath: getClipInset(nextClip, nextClip) },
          ],
          { duration: COLLECTION_MORPH.duration, easing: COLLECTION_MORPH.easing },
        );
        clipAnimation.currentTime = elapsed;
        reshape = { from: layout, elapsed, clip: clipAnimation };
      } else if (crossed) {
        endReshape();
      }
      layout = next;
      clip = nextClip;
      draw();
      wake();
    };
    const resize = new ResizeObserver(relayout);
    resize.observe(stage);
    compactQuery.addEventListener('change', relayout);
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
      if (reshape) reshape.elapsed += delta;
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
      if (reshape && reshape.elapsed >= COLLECTION_MORPH.duration) endReshape();
      const settled = elapsed >= MOTION.motionDuration && !reshape;
      if (resting && (frozenRef.current || settled)) {
        motion = 0;
        frame = 0;
        lastTime = 0;
        return;
      }
      frame = requestAnimationFrame(animate);
    };
    function wake() {
      if (frame || frozenRef.current || (pausedRef.current && motion === 0 && !reshape)) return;
      frame = requestAnimationFrame(animate);
    }
    wakeRef.current = wake;
    wake();
    window.addEventListener('wheel', steer, { passive: true });

    return () => {
      wakeRef.current = () => undefined;
      cancelAnimationFrame(frame);
      resize.disconnect();
      compactQuery.removeEventListener('change', relayout);
      endReshape();
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
  }, [count, enabled, keyboard]);

  return stageRef;
}
