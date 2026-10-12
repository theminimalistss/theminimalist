import { useCallback, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { soundEngine } from '@/audio/soundEngine';

const NAME = 'testimonial-card';
const STALL = 400;

function setName(element: Element | null | undefined, named: boolean) {
  if (!(element instanceof HTMLElement)) return;
  if (named) element.style.setProperty('view-transition-name', NAME);
  else element.style.removeProperty('view-transition-name');
}

const panel = () => document.querySelector('.testimonial-dialog-panel');

function visibleFrame(id: string) {
  const frames = document.querySelectorAll<HTMLElement>(
    `[data-frame][data-id="${CSS.escape(id)}"]`,
  );
  return (
    Array.from(frames).find((frame) => {
      const box = frame.getBoundingClientRect();
      return box.bottom > 0 && box.top < window.innerHeight && box.width > 0;
    }) ?? null
  );
}

export function useTestimonialDetail(count: number) {
  const [index, setIndex] = useState<number | null>(null);
  const [morphing, setMorphing] = useState(false);
  const source = useRef<HTMLElement | null>(null);
  const running = useRef(false);

  const morph = useCallback((swap: () => void, from: Element | null, to: () => Element | null) => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || typeof document.startViewTransition !== 'function' || !from || running.current) {
      flushSync(swap);
      return;
    }
    running.current = true;
    let swapped = false;
    const root = document.documentElement;
    root.dataset.transition = 'testimonial';
    setMorphing(true);
    setName(from, true);
    let target: Element | null = null;
    const transition = document.startViewTransition(() => {
      setName(from, false);
      if (swapped) return;
      swapped = true;
      flushSync(swap);
      target = to();
      setName(target, true);
    });
    transition.ready.catch(() => undefined);
    transition.updateCallbackDone.catch(() => undefined);
    const stall = window.setTimeout(() => {
      if (swapped) return;
      swapped = true;
      transition.skipTransition();
      flushSync(swap);
      running.current = false;
      setName(from, false);
      if (root.dataset.transition === 'testimonial') delete root.dataset.transition;
      setMorphing(false);
    }, STALL);
    void transition.finished.finally(() => {
      window.clearTimeout(stall);
      running.current = false;
      if (!swapped) flushSync(swap);
      setName(from, false);
      setName(target, false);
      if (root.dataset.transition === 'testimonial') delete root.dataset.transition;
      setMorphing(false);
    });
  }, []);

  const open = useCallback(
    (next: number, from: HTMLElement) => {
      source.current = from;
      soundEngine.swell('in');
      morph(() => setIndex(next), from, panel);
    },
    [morph],
  );

  const close = useCallback(
    (id?: string) => {
      const kept = source.current?.isConnected ? source.current : null;
      const back = kept ?? (id ? visibleFrame(id) : null);
      soundEngine.swell('out');
      morph(
        () => setIndex(null),
        panel(),
        () => back,
      );
    },
    [morph],
  );

  const step = useCallback(
    (direction: 1 | -1) => {
      source.current = null;
      setIndex((current) => (current === null ? current : (current + direction + count) % count));
    },
    [count],
  );

  return { index, morphing, open, close, step };
}
