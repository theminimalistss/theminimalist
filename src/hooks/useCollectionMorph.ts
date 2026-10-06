import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { COLLECTION_MORPH, COMPACT_QUERY } from '@/constants/motion';
import {
  getChromeEntrance,
  getChromeKeyframes,
  getClipInset,
  getGalleryKeyframes,
  getSpiralKeyframes,
  needsChromeMove,
  type CardPose,
  type Point,
  type Region,
} from '@/utils/collectionMorph';
import { readSpiralPose } from '@/utils/spiral';

type Snapshot = {
  poses: Map<string, CardPose>;
  chrome: Map<string, Region>;
  region: Region;
  vanish: Point | null;
};

const cardTiming = (index: number): KeyframeAnimationOptions => ({
  duration: COLLECTION_MORPH.duration,
  delay: index * COLLECTION_MORPH.stagger,
  easing: COLLECTION_MORPH.easing,
  fill: 'backwards',
});

const clipTiming = (count: number): KeyframeAnimationOptions => ({
  duration: COLLECTION_MORPH.duration + Math.max(0, count - 1) * COLLECTION_MORPH.stagger,
  easing: COLLECTION_MORPH.easing,
});

const windowRegion = (): Region => ({
  left: 0,
  top: 0,
  right: window.innerWidth,
  bottom: window.innerHeight,
});

function readSnapshot(root: HTMLElement): Snapshot {
  const poses = new Map<string, CardPose>();
  for (const card of root.querySelectorAll<HTMLElement>('[data-work-id]')) {
    const id = card.dataset.workId;
    const rect = card.getBoundingClientRect();
    if (!id || !rect.width) continue;
    const holder = card.closest<HTMLElement>('[data-spiral-item]');
    const settled = holder && !holder.getAnimations?.().length;
    const pose = settled ? readSpiralPose(holder.style.transform) : null;
    poses.set(id, {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
      width: pose ? card.offsetWidth * pose.scale : rect.width,
      rotateY: pose?.rotateY ?? 0,
      rotateZ: pose?.rotateZ ?? 0,
      depth: Number(holder?.style.zIndex) || 0,
    });
  }
  const chrome = new Map<string, Region>();
  for (const element of root.querySelectorAll<HTMLElement>('[data-morph-chrome]')) {
    const rect = element.getBoundingClientRect();
    if (element.dataset.morphChrome && rect.width) chrome.set(element.dataset.morphChrome, rect);
  }
  const clip = root.querySelector('.spiral-viewport')?.getBoundingClientRect();
  const stage = root.querySelector('.spiral-stage')?.getBoundingClientRect();
  const vanish = stage
    ? { x: stage.left + stage.width / 2, y: stage.top + stage.height / 2 }
    : null;
  return { poses, chrome, region: clip ?? windowRegion(), vanish };
}

function playChrome(root: HTMLElement, from: Map<string, Region>) {
  const timing = { duration: COLLECTION_MORPH.duration, easing: COLLECTION_MORPH.easing };
  return Array.from(root.querySelectorAll<HTMLElement>('[data-morph-chrome]')).flatMap(
    (element) => {
      const previous = from.get(element.dataset.morphChrome ?? '');
      const next = element.getBoundingClientRect();
      if (!next.width || !element.animate) return [];
      if (!previous) return [element.animate(getChromeEntrance(), timing)];
      if (!needsChromeMove(previous, next)) return [];
      return [
        element.animate(getChromeKeyframes(previous, next, COLLECTION_MORPH.chromeDip), timing),
      ];
    },
  );
}

function animateClip(container: HTMLElement | null, from: Region, to: Region, count: number) {
  if (!container?.animate) return [];
  const box = container.getBoundingClientRect();
  const keyframes = [{ clipPath: getClipInset(box, from) }, { clipPath: getClipInset(box, to) }];
  return [container.animate(keyframes, clipTiming(count))];
}

function playIntoGallery(root: HTMLElement, { poses, region, vanish }: Snapshot) {
  const cards = Array.from(root.querySelectorAll<HTMLElement>('.work-gallery [data-work-id]'));
  const flights = cards.flatMap((card, index) => {
    const pose = poses.get(card.dataset.workId ?? '');
    if (!pose || !card.animate) return [];
    const rect = card.getBoundingClientRect();
    const box = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, width: rect.width };
    return [card.animate(getGalleryKeyframes(pose, box, vanish ?? box), cardTiming(index))];
  });
  const gallery = root.querySelector<HTMLElement>('.work-gallery');
  return [...flights, ...animateClip(gallery, region, windowRegion(), cards.length)];
}

function playIntoSpiral(root: HTMLElement, { poses, region }: Snapshot) {
  const holders = Array.from(root.querySelectorAll<HTMLElement>('[data-spiral-item]'));
  const flights = holders.flatMap((holder, index) => {
    const id = holder.querySelector<HTMLElement>('[data-work-id]')?.dataset.workId;
    const pose = id ? poses.get(id) : undefined;
    const stage = holder.offsetParent;
    if (!pose || !(stage instanceof HTMLElement) || !holder.animate) return [];
    const origin = stage.getBoundingClientRect();
    const layout = {
      x: origin.left + holder.offsetLeft + holder.offsetWidth / 2,
      y: origin.top + holder.offsetTop + holder.offsetHeight / 2,
      width: holder.offsetWidth,
    };
    return [
      holder.animate(getSpiralKeyframes(pose, layout, holder.style.transform), cardTiming(index)),
    ];
  });
  const viewport = root.querySelector<HTMLElement>('.spiral-viewport');
  const target = viewport?.getBoundingClientRect();
  return [...flights, ...(target ? animateClip(viewport, region, target, holders.length) : [])];
}

export function useCollectionMorph(view: 'spiral' | 'gallery') {
  const rootRef = useRef<HTMLDivElement>(null);
  const snapshot = useRef<Snapshot | null>(null);
  const resting = useRef<Snapshot | null>(null);
  const generation = useRef(0);
  const [morphing, setMorphing] = useState(false);

  const capture = useCallback(() => {
    const root = rootRef.current;
    if (!root) return;
    const next = readSnapshot(root);
    if (!next.poses.size) return;
    snapshot.current = next;
    setMorphing(true);
  }, []);

  useLayoutEffect(() => {
    const from = snapshot.current;
    const root = rootRef.current;
    snapshot.current = null;
    if (!from || !root) return;
    const token = ++generation.current;
    const animations = [
      ...(view === 'spiral' ? playIntoSpiral(root, from) : playIntoGallery(root, from)),
      ...playChrome(root, from.chrome),
    ];
    void Promise.allSettled(animations.map((animation) => animation.finished)).then(() => {
      if (generation.current !== token) return;
      resting.current = readSnapshot(root);
      setMorphing(false);
    });
    return () => animations.forEach((animation) => animation.cancel());
  }, [view]);

  // Crossing the mobile breakpoint glides the text, and gallery cards, into the new layout.
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || typeof ResizeObserver !== 'function') return;
    const compactQuery = window.matchMedia(COMPACT_QUERY);
    const reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let compact = compactQuery.matches;
    let flights: Animation[] = [];
    resting.current ??= readSnapshot(root);
    const observer = new ResizeObserver(() => {
      const before = resting.current;
      if (compactQuery.matches !== compact && before && !reducedQuery.matches) {
        flights.forEach((flight) => flight.cancel());
        const current = [
          ...playChrome(root, before.chrome),
          ...(view === 'gallery' ? playIntoGallery(root, before) : []),
        ];
        flights = current;
        void Promise.allSettled(current.map((flight) => flight.finished)).then(() => {
          if (flights === current) resting.current = readSnapshot(root);
        });
      }
      compact = compactQuery.matches;
      resting.current = readSnapshot(root);
    });
    observer.observe(root);
    return () => {
      observer.disconnect();
      flights.forEach((flight) => flight.cancel());
    };
  }, [view]);

  return { rootRef, morphing, capture };
}
