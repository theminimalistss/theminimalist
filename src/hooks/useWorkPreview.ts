import { useCallback, useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { soundEngine } from '@/audio/soundEngine';
import type { Work } from '@/types/work';

type Part = [element: HTMLElement, name: string];

const TEXT_PARTS = ['title', 'tagline', 'category'];
const STALL = 400;

function collectParts(root: HTMLElement | null, media: HTMLElement | null): Part[] {
  if (!root) return [];
  const parts: Part[] = [[root, 'card']];
  if (media) parts.push([media, 'media']);
  for (const part of TEXT_PARTS) {
    const element = root.querySelector<HTMLElement>(`[data-work-part="${part}"]`);
    if (element) parts.push([element, part]);
  }
  return parts;
}

function cardParts(id: string, source: HTMLElement | null) {
  const card = source?.isConnected
    ? source
    : document.querySelector<HTMLElement>(`[data-work-id="${CSS.escape(id)}"]:not([data-echo])`);
  return collectParts(
    card,
    card?.querySelector(
      ':scope > .work-image, :scope > .work-video, :scope > [data-work-part="media"]',
    ) ?? null,
  );
}

function dialogParts() {
  const panel = document.querySelector<HTMLElement>('.work-dialog-inner');
  return collectParts(panel, panel?.querySelector('[data-work-part="media"]') ?? null);
}

function nameParts(parts: Part[], named: boolean) {
  for (const [element, part] of parts) {
    if (named) element.style.setProperty('view-transition-name', `work-${part}`);
    else element.style.removeProperty('view-transition-name');
  }
}

export function useWorkPreview<T extends { id: string } = Work>() {
  const [work, setWork] = useState<T | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const current = useRef<T | null>(null);
  const source = useRef<HTMLElement | null>(null);
  const active = useRef<ViewTransition | null>(null);
  const queued = useRef<{ next: T | null } | null>(null);

  useEffect(() => {
    current.current = work;
  });

  const morph = useCallback(function run(next: T | null) {
    if (active.current) {
      queued.current = { next };
      active.current.skipTransition();
      return;
    }
    const id = (next ?? current.current)?.id;
    if (id) soundEngine.swell(next ? 'in' : 'out');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!id || reduced || typeof document.startViewTransition !== 'function') {
      setWork(next);
      return;
    }
    const opening = next !== null;
    const from = opening ? cardParts(id, source.current) : dialogParts();
    let to: Part[] = [];
    let updated = false;
    const root = document.documentElement;
    setTransitioning(true);
    root.dataset.transition = 'work';
    nameParts(from, true);

    const update = () => {
      if (updated) return;
      updated = true;
      nameParts(from, false);
      flushSync(() => setWork(next));
      to = opening ? dialogParts() : cardParts(id, source.current);
      nameParts(to, true);
      if (opening) document.querySelector<HTMLElement>('.work-dialog-inner')?.focus();
    };
    const transition = document.startViewTransition(update);
    transition.ready.catch(() => undefined);
    transition.updateCallbackDone.catch(() => undefined);
    const stall = window.setTimeout(() => {
      if (updated) return;
      update();
      transition.skipTransition();
    }, STALL);
    active.current = transition;
    void transition.finished.finally(() => {
      window.clearTimeout(stall);
      if (!updated) update();
      nameParts(from, false);
      nameParts(to, false);
      delete root.dataset.transition;
      active.current = null;
      setTransitioning(false);
      const pending = queued.current;
      queued.current = null;
      if (pending) run(pending.next);
    });
  }, []);

  const open = useCallback(
    (next: T, from?: HTMLElement) => {
      source.current = from ?? null;
      morph(next);
    },
    [morph],
  );
  const close = useCallback(() => morph(null), [morph]);
  const show = useCallback((next: T) => {
    source.current = null;
    setWork(next);
  }, []);

  return { work, transitioning, open, close, show };
}
