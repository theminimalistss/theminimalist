import { useCallback, useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import type { Work } from '@/types/work';

type Part = [element: HTMLElement, name: string];

const TEXT_PARTS = ['title', 'tagline', 'category'];

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

function cardParts(id: string) {
  const card = document.querySelector<HTMLElement>(`[data-work-id="${CSS.escape(id)}"]`);
  return collectParts(
    card,
    card?.querySelector(':scope > .work-image, :scope > .work-video') ?? null,
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

export function useWorkPreview() {
  const [work, setWork] = useState<Work | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const current = useRef<Work | null>(null);
  const active = useRef<ViewTransition | null>(null);
  const queued = useRef<{ next: Work | null } | null>(null);

  useEffect(() => {
    current.current = work;
  });

  const morph = useCallback(function run(next: Work | null) {
    if (active.current) {
      queued.current = { next };
      active.current.skipTransition();
      return;
    }
    const id = (next ?? current.current)?.id;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!id || reduced || typeof document.startViewTransition !== 'function') {
      setWork(next);
      return;
    }
    const opening = next !== null;
    const from = opening ? cardParts(id) : dialogParts();
    let to: Part[] = [];
    const root = document.documentElement;
    setTransitioning(true);
    root.dataset.transition = 'work';
    nameParts(from, true);

    const transition = document.startViewTransition(() => {
      nameParts(from, false);
      flushSync(() => setWork(next));
      to = opening ? dialogParts() : cardParts(id);
      nameParts(to, true);
      if (opening) document.querySelector<HTMLElement>('.work-dialog-inner')?.focus();
    });
    active.current = transition;
    void transition.finished.finally(() => {
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

  const open = useCallback((next: Work) => morph(next), [morph]);
  const close = useCallback(() => morph(null), [morph]);

  return { work, transitioning, open, close };
}
