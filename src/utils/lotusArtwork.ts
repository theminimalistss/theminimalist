import { LOTUS_MARK } from '@/constants/brand';

export type LotusArtwork = {
  source: HTMLCanvasElement;
  width: number;
  height: number;
  base: [number, number];
  reach: number;
};

const PADDING = 14;
const FONT_FAMILY = '"Inter Tight Variable", Arial, sans-serif';

export const LOTUS_FONT = `300 14px ${FONT_FAMILY}`;

function trackedWidth(context: CanvasRenderingContext2D, text: string, tracking: number) {
  return context.measureText(text).width + tracking * (text.length - 1);
}

function drawTracked(
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  tracking: number,
) {
  let cursor = x;
  for (const character of text) {
    context.fillText(character, cursor, y);
    cursor += context.measureText(character).width + tracking;
  }
}

export function paintLotusArtwork(compact: boolean, ratio: number): LotusArtwork | null {
  const { viewBox, strokeWidth, paths, base, textLine, established } = LOTUS_MARK;
  const source = document.createElement('canvas');
  const context = source.getContext('2d');
  if (!context) return null;

  const markWidth = compact ? 80 : 104;
  const scale = markWidth / viewBox.width;
  const markHeight = viewBox.height * scale;
  const fontSize = compact ? 11 : 14;
  const tracking = fontSize * 0.42;
  const gap = compact ? 22 : 34;
  const [before, after] = established;

  context.font = `300 ${fontSize}px ${FONT_FAMILY}`;
  const side =
    Math.max(trackedWidth(context, before, tracking), trackedWidth(context, after, tracking)) + gap;
  const width = markWidth + side * 2 + PADDING * 2;
  const height = markHeight + PADDING * 2;
  source.width = Math.ceil(width * ratio);
  source.height = Math.ceil(height * ratio);

  context.scale(ratio, ratio);
  context.strokeStyle = '#fff';
  context.fillStyle = '#fff';
  context.lineCap = 'round';
  context.lineJoin = 'round';

  context.save();
  context.translate(PADDING + side, PADDING);
  context.scale(scale, scale);
  context.translate(-viewBox.x, -viewBox.y);
  context.lineWidth = strokeWidth;
  for (const path of paths) context.stroke(new Path2D(path));
  context.restore();

  context.font = `300 ${fontSize}px ${FONT_FAMILY}`;
  context.textBaseline = 'middle';
  const textY = PADDING + (textLine - viewBox.y) * scale;
  const markLeft = PADDING + side;
  drawTracked(
    context,
    before,
    markLeft - gap - trackedWidth(context, before, tracking),
    textY,
    tracking,
  );
  drawTracked(context, after, markLeft + markWidth + gap, textY, tracking);

  const baseUv: [number, number] = [
    (markLeft + (base.x - viewBox.x) * scale) / width,
    1 - (PADDING + (base.y - viewBox.y) * scale) / height,
  ];
  const aspect = width / height;
  const reach = Math.max(
    ...[
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ].map(([x = 0, y = 0]) => Math.hypot((x - baseUv[0]) * aspect, y - baseUv[1])),
  );

  return { source, width, height, base: baseUv, reach };
}
