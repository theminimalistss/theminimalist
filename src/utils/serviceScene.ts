import { TESSERACT_FRAGMENT, TESSERACT_VERTEX } from '@/shaders/tesseract';
import { clamp01, easeInOutCubic } from '@/utils/easing';
import {
  SERVICE_DRAWINGS,
  SERVICE_FACES,
  insidePolygon,
  movePoint,
  partPose,
  scheduleStrokes,
  traceLine,
  triangulate,
  type DrawingFace,
  type DrawingLine,
  type DrawingPoint,
  type PartPose,
  type StrokeTone,
} from '@/utils/serviceDrawing';
import { fitCanvas, readColorToken } from '@/utils/webgl';

const BOARD = { width: 480, height: 320 };

const STROKE: Record<StrokeTone, { thickness: number; fade: number; dash?: [number, number] }> = {
  edge: { thickness: 3, fade: 0.92 },
  detail: { thickness: 2.6, fade: 0.55 },
  trail: { thickness: 2, fade: 0.42, dash: [3, 4] },
};

const IDLE = { flow: 7, breath: 0.0016, depth: 0.22 };
const OCCLUSION_STEP = 1.5;

const FACE: Record<DrawingFace['tone'], number> = { light: 1, shade: 2.4, clay: 4 };
const FACES_FROM = 0.72;

export type DrawingMotion = { seconds: number; amount: number };

const CORNERS = [
  [0, -1],
  [1, -1],
  [1, 1],
  [0, -1],
  [1, 1],
  [0, 1],
] as const;

const schedules = SERVICE_DRAWINGS.map((strokes) => scheduleStrokes(strokes));
const meshes = SERVICE_FACES.map((faces) =>
  faces.map((face) => ({ ...face, indices: triangulate(face.points) })),
);

export function createServiceScene(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext('webgl', {
    alpha: true,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: 'low-power',
    premultipliedAlpha: true,
  });
  if (!gl || gl.isContextLost()) return null;
  const program = gl.createProgram();
  const vertex = gl.createShader(gl.VERTEX_SHADER);
  const fragment = gl.createShader(gl.FRAGMENT_SHADER);
  const buffer = gl.createBuffer();
  const dispose = () => {
    gl.deleteBuffer(buffer);
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);
    gl.deleteProgram(program);
  };
  if (!program || !vertex || !fragment || !buffer) {
    dispose();
    return null;
  }
  gl.shaderSource(vertex, TESSERACT_VERTEX);
  gl.compileShader(vertex);
  gl.shaderSource(fragment, TESSERACT_FRAGMENT);
  gl.compileShader(fragment);
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    dispose();
    return null;
  }
  gl.useProgram(program);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  const position = gl.getAttribLocation(program, 'a_position');
  const detail = gl.getAttribLocation(program, 'a_detail');
  gl.enableVertexAttribArray(position);
  gl.enableVertexAttribArray(detail);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 16, 0);
  gl.vertexAttribPointer(detail, 2, gl.FLOAT, false, 16, 8);
  const color = gl.getUniformLocation(program, 'u_color');
  const ink = readColorToken('--color-brand');
  const clay = readColorToken('--color-warm-accent');
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  let data = new Float32Array(4096);

  return {
    draw(
      stage: number,
      reveal: number,
      time = 0,
      motion: DrawingMotion = { seconds: 0, amount: 0 },
    ) {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (!width || !height) return;
      fitCanvas(canvas, width, height);
      const unit = width / BOARD.width;
      let offset = 0;
      const push = (x: number, y: number, side: number, alpha: number) => {
        if (offset + 4 > data.length) {
          const grown = new Float32Array(data.length * 2);
          grown.set(data);
          data = grown;
        }
        data[offset++] = x / (BOARD.width / 2) - 1;
        data[offset++] = 1 - y / (BOARD.height / 2);
        data[offset++] = side;
        data[offset++] = alpha;
      };
      const poses = new Map<number, PartPose>();
      const poseOf = (part = -1) => {
        let pose = poses.get(part);
        if (!pose) {
          pose = partPose(stage, part, motion.seconds, motion.amount);
          poses.set(part, pose);
        }
        return pose;
      };
      const facesShown = easeInOutCubic(clamp01((reveal - FACES_FROM) / (1 - FACES_FROM)));
      const counts = [0, 0];
      if (facesShown > 0)
        (['plain', 'clay'] as const).forEach((pass, which) => {
          const start = offset;
          for (const face of meshes[stage] ?? []) {
            if ((face.tone === 'clay') !== (pass === 'clay')) continue;
            const pose = poseOf(face.part);
            for (const index of face.indices) {
              const [x, y] = movePoint(face.points[index]!, pose);
              push(x, y, 2, FACE[face.tone] * facesShown);
            }
          }
          counts[which] = (offset - start) / 4;
        });
      let occluders: DrawingLine[] = [];
      const visible = (
        from: DrawingPoint,
        to: DrawingPoint,
        emit: (a: DrawingPoint, b: DrawingPoint) => void,
      ) => {
        if (!occluders.length) return emit(from, to);
        const length = Math.hypot(to[0] - from[0], to[1] - from[1]);
        const pieces = Math.max(1, Math.ceil(length / OCCLUSION_STEP));
        let start: DrawingPoint | null = null;
        for (let piece = 0; piece < pieces; piece++) {
          const a: DrawingPoint = [
            from[0] + ((to[0] - from[0]) * piece) / pieces,
            from[1] + ((to[1] - from[1]) * piece) / pieces,
          ];
          const b: DrawingPoint = [
            from[0] + ((to[0] - from[0]) * (piece + 1)) / pieces,
            from[1] + ((to[1] - from[1]) * (piece + 1)) / pieces,
          ];
          const middle: DrawingPoint = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
          const hidden = occluders.some((polygon) => insidePolygon(middle, polygon));
          if (!hidden && !start) start = a;
          if (hidden && start) {
            emit(start, a);
            start = null;
          }
        }
        if (start) emit(start, to);
      };
      const segment = (from: DrawingPoint, to: DrawingPoint, tone: StrokeTone, fade: number) => {
        const { thickness } = STROKE[tone];
        const dx = to[0] - from[0];
        const dy = to[1] - from[1];
        const length = Math.hypot(dx, dy);
        if (!length) return;
        const half = thickness / unit;
        const reach = (half * 0.2) / length;
        const nx = (-dy / length) * half;
        const ny = (dx / length) * half;
        for (const [which, side] of CORNERS) {
          const along = which ? 1 + reach : -reach;
          push(from[0] + dx * along + nx * side, from[1] + dy * along + ny * side, side, fade);
        }
      };
      (schedules[stage] ?? []).forEach((stroke, order) => {
        const drawn = easeInOutCubic(clamp01((reveal - stroke.start) / stroke.span));
        if (drawn <= 0) return;
        const pose = poseOf(stroke.part);
        const points = traceLine(stroke.points, drawn).map((point) => movePoint(point, pose));
        occluders = (stroke.behind ?? []).flatMap((part) =>
          (SERVICE_FACES[stage] ?? [])
            .filter((face) => face.part === part)
            .map((face) => face.points.map((point) => movePoint(point, poseOf(part)))),
        );
        const { dash, fade } = STROKE[stroke.tone];
        const alpha =
          stroke.tone === 'detail'
            ? fade * (1 - IDLE.depth * (0.5 + 0.5 * Math.sin(time * IDLE.breath + order * 1.7)))
            : fade;
        if (!dash) {
          for (let index = 1; index < points.length; index++)
            visible(points[index - 1]!, points[index]!, (a, b) =>
              segment(a, b, stroke.tone, alpha),
            );
          return;
        }
        const [on, off] = dash.map((value) => value / unit) as [number, number];
        const marks = [0];
        for (let index = 1; index < points.length; index++) {
          const from = points[index - 1]!;
          const to = points[index]!;
          marks.push(marks[index - 1]! + Math.hypot(to[0] - from[0], to[1] - from[1]));
        }
        const at = (distance: number, index: number): DrawingPoint => {
          const from = points[index - 1]!;
          const to = points[index]!;
          const span = marks[index]! - marks[index - 1]!;
          const amount = span ? (distance - marks[index - 1]!) / span : 0;
          return [from[0] + (to[0] - from[0]) * amount, from[1] + (to[1] - from[1]) * amount];
        };
        const total = marks[marks.length - 1]!;
        const period = on + off;
        const shift = ((time / 1000) * IDLE.flow) / unit;
        for (let begin = (shift % period) - period; begin < total; begin += period) {
          const end = Math.min(total, begin + on);
          for (let index = 1; index < points.length; index++) {
            const low = Math.max(begin, marks[index - 1]!);
            const high = Math.min(end, marks[index]!);
            if (high > low)
              visible(at(low, index), at(high, index), (a, b) => segment(a, b, stroke.tone, alpha));
          }
        }
      });
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      if (!offset) return;
      gl.bufferData(gl.ARRAY_BUFFER, data.subarray(0, offset), gl.DYNAMIC_DRAW);
      const [plain = 0, warm = 0] = counts;
      gl.uniform3fv(color, ink);
      if (plain) gl.drawArrays(gl.TRIANGLES, 0, plain);
      gl.uniform3fv(color, clay);
      if (warm) gl.drawArrays(gl.TRIANGLES, plain, warm);
      gl.uniform3fv(color, ink);
      gl.drawArrays(gl.TRIANGLES, plain + warm, offset / 4 - plain - warm);
    },
    dispose,
  };
}
