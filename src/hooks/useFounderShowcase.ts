import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { FOUNDER_SHOWCASE } from '@/constants/motion';
import { useAppEntered } from '@/hooks/useAppEntered';
import { usePageVisibility } from '@/hooks/usePageVisibility';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/** Owns the marquee, timed selection, and all playback suspension. */
export function useFounderShowcase(count: number) {
  const ref = useRef<HTMLElement>(null);
  const tracksRef = useRef<HTMLDivElement>(null);
  const animations = useRef<Animation[]>([]);
  const entered = useAppEntered();
  const reducedMotion = useReducedMotion();
  const visible = usePageVisibility();
  const [{ active, direction }, setSlide] = useState({ active: 0, direction: 1 });
  const shown = useRef(active);
  const [paused, setPaused] = useState(false);
  const [hovered, holdPointer] = useState(false);
  const [focused, holdFocus] = useState(false);
  const [inView, setInView] = useState(true);
  const playing = entered && !reducedMotion && !paused && visible && inView;
  const running = playing && !hovered && !focused;

  useEffect(() => {
    const element = ref.current;
    if (!element || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(([entry]) => setInView(!!entry?.isIntersecting));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!entered || reducedMotion) return;
    const tracks = tracksRef.current?.querySelectorAll<HTMLElement>('[data-name-track]');
    if (!tracks) return;
    animations.current = Array.from(tracks).flatMap((track) => {
      if (!track.animate) return [];
      const animation = track.animate(
        [{ transform: 'translateX(0)' }, { transform: 'translateX(-50%)' }],
        { duration: FOUNDER_SHOWCASE.marqueeDuration, iterations: Infinity, easing: 'linear' },
      );
      animation.pause();
      return [animation];
    });
    return () => {
      animations.current.forEach((animation) => animation.cancel());
      animations.current = [];
    };
  }, [count, entered, reducedMotion]);

  useEffect(() => {
    animations.current.forEach((animation) => {
      if (playing) animation.play();
      else animation.pause();
    });
  }, [playing, count, entered, reducedMotion]);

  const go = useCallback(
    (step: 1 | -1) =>
      setSlide((slide) => ({ active: (slide.active + step + count) % count, direction: step })),
    [count],
  );
  const select = useCallback(
    (index: number) =>
      setSlide((slide) =>
        index === slide.active
          ? slide
          : { active: index, direction: index > slide.active ? 1 : -1 },
      ),
    [],
  );

  useEffect(() => {
    if (!running || count < 2) return;
    const timer = window.setTimeout(() => go(1), FOUNDER_SHOWCASE.interval);
    return () => window.clearTimeout(timer);
  }, [active, count, running, go]);

  useLayoutEffect(() => {
    const previous = shown.current;
    shown.current = active;
    const stage = tracksRef.current;
    if (!stage || previous === active || reducedMotion) return;
    const scenes = stage.querySelectorAll<HTMLElement>('[data-scene]');
    const leaving = scenes[previous];
    const arriving = scenes[active];
    if (!leaving?.animate || !arriving?.animate) return;
    const timing = {
      duration: FOUNDER_SHOWCASE.slideDuration,
      easing: FOUNDER_SHOWCASE.slideEasing,
    };
    leaving.dataset.leaving = '';
    const out = leaving.animate(
      [{ transform: 'translateX(0)' }, { transform: `translateX(${-direction * 100}%)` }],
      timing,
    );
    const into = arriving.animate(
      [{ transform: `translateX(${direction * 100}%)` }, { transform: 'translateX(0)' }],
      timing,
    );
    const done = () => delete leaving.dataset.leaving;
    void out.finished.then(done, done);
    return () => {
      out.cancel();
      into.cancel();
      done();
    };
  }, [active, direction, reducedMotion]);

  useLayoutEffect(() => {
    const stage = tracksRef.current;
    if (!stage) return;
    stage.querySelectorAll<HTMLElement>('.founder-step-label').forEach((label) => {
      const text = label.firstElementChild;
      if (text instanceof HTMLElement) label.style.width = `${text.offsetWidth}px`;
    });
  }, [active]);

  useEffect(() => {
    const stage = tracksRef.current;
    if (!stage || count < 2) return;
    let start: { id: number; x: number; y: number } | null = null;
    const down = (event: PointerEvent) => {
      if (!event.isPrimary || (event.target as Element).closest('button, a')) return;
      start = { id: event.pointerId, x: event.clientX, y: event.clientY };
    };
    const up = (event: PointerEvent) => {
      if (!start || event.pointerId !== start.id) return;
      const dx = event.clientX - start.x;
      const dy = event.clientY - start.y;
      start = null;
      if (Math.abs(dx) > FOUNDER_SHOWCASE.swipe && Math.abs(dx) > Math.abs(dy) * 1.2)
        go(dx < 0 ? 1 : -1);
    };
    const cancel = () => {
      start = null;
    };
    const cueTarget =
      '.founder-scene[data-active] :is(.founder-marquee, .founder-portrait-shell), .founder-step';
    const over = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      const target = event.target instanceof Element ? event.target.closest(cueTarget) : null;
      stage.toggleAttribute('data-cue', !!target);
    };
    const leave = () => stage.removeAttribute('data-cue');
    stage.addEventListener('pointerover', over);
    stage.addEventListener('pointerleave', leave);
    stage.addEventListener('pointerdown', down);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', cancel);
    return () => {
      stage.removeEventListener('pointerover', over);
      stage.removeEventListener('pointerleave', leave);
      stage.removeEventListener('pointerdown', down);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', cancel);
    };
  }, [count, go]);

  return {
    ref,
    tracksRef,
    active,
    select,
    go,
    paused,
    running,
    reducedMotion,
    holdPointer,
    holdFocus,
    togglePause: () => setPaused((value) => !value),
  };
}
