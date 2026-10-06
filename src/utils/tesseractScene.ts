import { TESSERACT } from '@/constants/tesseract';
import { TESSERACT_FRAGMENT, TESSERACT_VERTEX } from '@/shaders/tesseract';
import { clamp01, easeInOutCubic } from '@/utils/easing';
import {
  createTesseractGeometry,
  getTraceSchedule,
  projectPoint,
  toSolid,
} from '@/utils/tesseract';
import { readColorToken } from '@/utils/webgl';

export type TesseractScene = {
  /** `reveal` runs 0 → 1 while the edges are traced in, then the faces appear. */
  draw: (yaw: number, pitch: number, width: number, height: number, reveal?: number) => void;
  dispose: () => void;
};

export function createTesseractScene(canvas: HTMLCanvasElement): TesseractScene | null {
  const gl = canvas.getContext('webgl', {
    alpha: true,
    antialias: false,
    depth: false,
    stencil: false,
    premultipliedAlpha: true,
    powerPreference: 'low-power',
  });
  if (!gl || gl.isContextLost()) return null;
  const program = gl.createProgram();
  const buffer = gl.createBuffer();
  const vertex = gl.createShader(gl.VERTEX_SHADER);
  const fragment = gl.createShader(gl.FRAGMENT_SHADER);
  const dispose = () => {
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);
    gl.deleteBuffer(buffer);
    gl.deleteProgram(program);
  };
  if (!program || !buffer || !vertex || !fragment) {
    dispose();
    return null;
  }
  gl.shaderSource(vertex, TESSERACT_VERTEX);
  gl.shaderSource(fragment, TESSERACT_FRAGMENT);
  gl.compileShader(vertex);
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
  const geometry = createTesseractGeometry();
  // The solid is rigid: only the 3D rotation changes from frame to frame.
  const solid = geometry.vertices.map(toSolid);
  const strokes = getTraceSchedule(geometry.edges);
  // Six vertices per edge; position + line distance + depth opacity. Reused every frame.
  const data = new Float32Array((geometry.edges.length + geometry.faces.length) * 6 * 4);
  gl.bufferData(gl.ARRAY_BUFFER, data.byteLength, gl.DYNAMIC_DRAW);
  const position = gl.getAttribLocation(program, 'a_position');
  const detail = gl.getAttribLocation(program, 'a_detail');
  gl.enableVertexAttribArray(position);
  gl.enableVertexAttribArray(detail);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 16, 0);
  gl.vertexAttribPointer(detail, 2, gl.FLOAT, false, 16, 8);
  gl.uniform3fv(gl.getUniformLocation(program, 'u_color'), readColorToken('--color-brand'));
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  const corners = [
    [0, -1],
    [1, -1],
    [1, 1],
    [0, -1],
    [1, 1],
    [0, 1],
  ] as const;

  return {
    draw(yaw, pitch, width, height, reveal = 1) {
      const ratio = Math.min(
        window.devicePixelRatio || 1,
        TESSERACT.maxPixelRatio,
        TESSERACT.maxBufferSize / Math.max(width, height),
      );
      const pixelWidth = Math.max(1, Math.round(width * ratio));
      const pixelHeight = Math.max(1, Math.round(height * ratio));
      if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
        canvas.width = pixelWidth;
        canvas.height = pixelHeight;
      }
      const scale = Math.min(width, height) * TESSERACT.scale;
      const points = solid.map((point) => projectPoint(point, yaw, pitch));
      const faces = easeInOutCubic(clamp01((reveal - 0.78) / 0.22));
      let offset = 0;
      for (const [a, b, c, d] of geometry.faces) {
        for (const index of [a, b, c, a, c, d]) {
          const point = points[index]!;
          data[offset++] = (point.x * scale * 2) / width;
          data[offset++] = (point.y * scale * 2) / height;
          data[offset++] = 2;
          data[offset++] = Math.max(0.25, 0.65 + point.z * 0.2) * faces;
        }
      }
      for (const { from, to, start: begin, length: span } of strokes) {
        const start = points[from]!;
        const target = points[to]!;
        const drawn = easeInOutCubic(clamp01((reveal - begin) / span));
        const end = {
          x: start.x + (target.x - start.x) * drawn,
          y: start.y + (target.y - start.y) * drawn,
          z: start.z + (target.z - start.z) * drawn,
        };
        const dx = target.x - start.x;
        const dy = target.y - start.y;
        const length = Math.max(0.001, Math.hypot(dx, dy));
        const nx = (-dy / length) * 3 * Math.sign(drawn);
        const ny = (dx / length) * 3 * Math.sign(drawn);
        for (const [which, side] of corners) {
          const point = which ? end : start;
          data[offset++] = ((point.x * scale + nx * side) * 2) / width;
          data[offset++] = ((point.y * scale + ny * side) * 2) / height;
          data[offset++] = side;
          data[offset++] = Math.max(0.2, Math.min(1, 0.58 + point.z * 0.22));
        }
      }
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, data);
      gl.drawArrays(gl.TRIANGLES, 0, data.length / 4);
    },
    dispose,
  };
}
