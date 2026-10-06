import { TESSERACT } from '@/constants/tesseract';

export type PreviewAnchor = { x: number; y: number; width: number; height: number };
export type PreviewPlacement = { left: number; top: number; width: number; height: number };

const CAPTION = 116;
const BOTTOM = { narrow: 150, wide: 96 };

export function getPreviewPlacement(anchor: PreviewAnchor): PreviewPlacement {
  const width = Math.min(280, anchor.width - 48, anchor.height * 0.32);
  const height = width * 1.25;
  const left = anchor.x < anchor.width * 0.52 ? anchor.x + 42 : anchor.x - width - 42;
  const safeTop = Math.min(150, anchor.height * 0.2);
  const bottom = anchor.width < 768 ? BOTTOM.narrow : BOTTOM.wide;
  const lowest = anchor.height - height - CAPTION - bottom;
  return {
    left: Math.max(24, Math.min(anchor.width - width - 24, left)),
    top: Math.max(safeTop, Math.min(lowest, anchor.y - height * 0.5)),
    width,
    height,
  };
}

const FOCUS_SLOT = { gutter: 48, top: 150, bottom: 176, copy: 104, sculpture: 1.8 };

/**
 * A fixed slot beside the sculpture for the study in focus, or null when the viewport
 * leaves no room for it without covering the sculpture.
 */
export function getFocusPlacement(view: Pick<PreviewAnchor, 'width' | 'height'>) {
  const { gutter, top, bottom, copy, sculpture } = FOCUS_SLOT;
  const radius = Math.min(view.width, view.height) * TESSERACT.scale * sculpture;
  const room = view.width / 2 - radius - gutter * 1.5;
  const width = Math.min(280, room, (view.height - top - bottom - copy) / 1.25);
  if (view.width < 1000 || width < 180) return null;
  const height = width * 1.25;
  const middle = (view.height - height - copy) / 2;
  return {
    left: view.width - gutter - width,
    top: Math.max(top, Math.min(view.height - bottom - copy - height, middle)),
    width,
    height,
  } satisfies PreviewPlacement;
}
