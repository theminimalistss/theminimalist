import { useEffect, useRef } from 'react';
import { STUDIO_SPRIG } from '@/constants/motion';
import { useAppEntered } from '@/hooks/useAppEntered';
import { usePageVisibility } from '@/hooks/usePageVisibility';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export function useStudioSprig(filterId: string) {
  const ref = useRef<HTMLDivElement>(null);
  const entered = useAppEntered();
  const pageVisible = usePageVisibility();
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const mark = ref.current;
    const svg = mark?.querySelector('svg');
    const stem = mark?.querySelector<SVGGElement>('[data-sprig-stem]');
    const response = mark?.querySelector<SVGGElement>('[data-sprig-response]');
    const parts = mark?.querySelectorAll<SVGGElement>('[data-sprig-leaf], [data-sprig-petal]');
    if (!mark || !svg || !stem || !response || !parts || !entered || !pageVisible || reducedMotion)
      return;
    const noise = svg.querySelector('feTurbulence');
    const warp = svg.querySelector('feDisplacementMap');
    const { period, fps, stiffness, damping, tilt, doodleInterval } = STUDIO_SPRIG;
    const wind = (element: SVGGElement, amplitude: number, index: number) => {
      if (!element.animate) return null;
      const animation = element.animate(
        [
          { transform: 'rotate(' + -amplitude + 'deg)' },
          { transform: 'rotate(' + amplitude + 'deg)' },
          { transform: 'rotate(' + -amplitude + 'deg)' },
        ],
        { duration: period * 1_000 + index * 240, iterations: Infinity, easing: 'ease-in-out' },
      );
      animation.pause();
      animation.currentTime = index * 670;
      return animation;
    };
    const winds = [
      wind(stem, 2.2, 0),
      ...Array.from(parts, (part, index) =>
        wind(part, part.hasAttribute('data-sprig-leaf') ? 1.6 : 0.9, index + 1),
      ),
    ].filter((animation): animation is Animation => animation !== null);
    let frame = 0;
    let previous = 0;
    let inView = false;
    let hovered = false;
    let target = 0;
    let angle = 0;
    let velocity = 0;
    let energy = 0;
    let nextDoodle = 0;
    let seed = 1;
    let filtered = false;
    let written = '';
    let bounds: DOMRect | undefined;
    const setFilter = (enabled: boolean) => {
      if (enabled === filtered) return;
      filtered = enabled;
      svg.style.filter = enabled ? 'url(#' + filterId + ')' : '';
    };
    const step = (time: number) => {
      frame = 0;
      if (!inView) return;
      if (previous && time - previous < 1_000 / fps) {
        frame = requestAnimationFrame(step);
        return;
      }
      const seconds = previous ? Math.min(0.05, (time - previous) / 1_000) : 1 / fps;
      previous = time;
      velocity += ((target - angle) * stiffness - velocity * damping) * seconds;
      angle += velocity * seconds;
      energy *= Math.exp(-seconds * 3);
      const pose = angle.toFixed(2);
      if (pose !== written) {
        written = pose;
        response.style.transform = 'rotate(' + pose + 'deg)';
      }
      const doodle = Math.max(hovered ? 0.65 : 0, energy);
      setFilter(doodle > 0.03);
      if (doodle > 0.03 && time >= nextDoodle) {
        seed = (seed % 3) + 1;
        noise?.setAttribute('seed', String(seed));
        warp?.setAttribute('scale', (STUDIO_SPRIG.doodleScale * doodle).toFixed(3));
        nextDoodle = time + doodleInterval;
      }
      if (!hovered && energy < 0.03 && Math.abs(angle) < 0.025 && Math.abs(velocity) < 0.08) {
        response.style.transform = '';
        written = '';
        previous = 0;
        delete mark.dataset.doodling;
        return;
      }
      frame = requestAnimationFrame(step);
    };
    const wake = () => {
      if (!frame && inView) frame = requestAnimationFrame(step);
    };
    const move = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      bounds ??= mark.getBoundingClientRect();
      if (!bounds.width) return;
      const x = Math.max(-1, Math.min(1, ((event.clientX - bounds.left) / bounds.width) * 2 - 1));
      target = x * tilt;
      hovered = true;
      mark.dataset.doodling = '';
      winds.forEach((animation) => {
        animation.playbackRate = 1.6;
      });
      wake();
    };
    const leave = () => {
      hovered = false;
      target = 0;
      bounds = undefined;
      if (energy < 0.03) delete mark.dataset.doodling;
      winds.forEach((animation) => {
        animation.playbackRate = 1;
      });
    };
    const nudge = () => {
      velocity = Math.max(-80, Math.min(80, velocity + Math.sign(target || 1) * 35));
      energy = 1;
      mark.dataset.doodling = '';
      wake();
    };
    const suspend = () => {
      cancelAnimationFrame(frame);
      frame = previous = 0;
      angle = velocity = energy = 0;
      written = '';
      leave();
      winds.forEach((animation) => animation.pause());
      response.style.transform = '';
      setFilter(false);
      delete mark.dataset.waving;
    };
    const visibility = (shown: boolean) => {
      inView = shown;
      if (shown) {
        winds.forEach((animation) => animation.play());
        if (winds.length) mark.dataset.waving = '';
      } else suspend();
    };
    const observer =
      typeof IntersectionObserver === 'function'
        ? new IntersectionObserver(([entry]) => visibility(!!entry?.isIntersecting), {
            threshold: 0.1,
          })
        : undefined;
    if (observer) observer.observe(mark);
    else visibility(true);
    const clearBounds = () => {
      bounds = undefined;
    };
    mark.addEventListener('pointerenter', move);
    mark.addEventListener('pointermove', move, { passive: true });
    mark.addEventListener('pointerleave', leave);
    mark.addEventListener('pointercancel', leave);
    mark.addEventListener('pointerdown', nudge);
    window.addEventListener('resize', clearBounds);
    window.addEventListener('scroll', clearBounds, { passive: true });
    return () => {
      observer?.disconnect();
      mark.removeEventListener('pointerenter', move);
      mark.removeEventListener('pointermove', move);
      mark.removeEventListener('pointerleave', leave);
      mark.removeEventListener('pointercancel', leave);
      mark.removeEventListener('pointerdown', nudge);
      window.removeEventListener('resize', clearBounds);
      window.removeEventListener('scroll', clearBounds);
      suspend();
      winds.forEach((animation) => animation.cancel());
    };
  }, [entered, filterId, pageVisible, reducedMotion]);

  return ref;
}
