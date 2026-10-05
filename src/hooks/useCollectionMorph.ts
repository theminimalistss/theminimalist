import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { COLLECTION_MORPH } from '@/constants/motion';
import {
  getClipInset,
  getGalleryKeyframes,
  getSpiralKeyframes,
  type CardPose,
  type Region,
} from '@/utils/collectionMorph';
import { readSpiralPose } from '@/utils/spiral';

type Snapshot = { poses: Map<string, CardPose>; region: Region };

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
    });
  }
  const clip = root.querySelector('.spiral-viewport')?.getBoundingClientRect();
  return { poses, region: clip ?? windowRegion() };
}

function animateClip(container: HTMLElement | null, from: Region, to: Region, count: number) {
  if (!container?.animate) return [];
  const box = container.getBoundingClientRect();
  const keyframes = [{ clipPath: getClipInset(box, from) }, { clipPath: getClipInset(box, to) }];
  return [container.animate(keyframes, clipTiming(count))];
}

function playIntoGallery(root: HTMLElement, { poses, region }: Snapshot) {
  const cards = Array.from(root.querySelectorAll<HTMLElement>('.work-gallery [data-work-id]'));
  const flights = cards.flatMap((card, index) => {
    const pose = poses.get(card.dataset.workId ?? '');
    if (!pose || !card.animate) return [];
    const rect = card.getBoundingClientRect();
    const box = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, width: rect.width };
    return [card.animate(getGalleryKeyframes(pose, box), cardTiming(index))];
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
    const animations = view === 'spiral' ? playIntoSpiral(root, from) : playIntoGallery(root, from);
    void Promise.allSettled(animations.map((animation) => animation.finished)).then(() => {
      if (generation.current === token) setMorphing(false);
    });
    return () => animations.forEach((animation) => animation.cancel());
  }, [view]);

  return { rootRef, morphing, capture };
}
