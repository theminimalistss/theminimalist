import { PARTICLE_FRAGMENT, PARTICLE_VERTEX } from '@/shaders/particles';
import type { PreviewAnchor, PreviewPlacement } from '@/utils/particlePreview';
import { TESSERACT } from '@/constants/tesseract';

export function createParticleScene(canvas: HTMLCanvasElement, columns?: number) {
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
  const vertex = gl.createShader(gl.VERTEX_SHADER);
  const fragment = gl.createShader(gl.FRAGMENT_SHADER);
  const buffer = gl.createBuffer();
  const textures = new Map<number, WebGLTexture>();
  const dispose = () => {
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);
    gl.deleteBuffer(buffer);
    textures.forEach((texture) => gl.deleteTexture(texture));
    textures.clear();
    gl.deleteProgram(program);
  };
  if (!program || !vertex || !fragment || !buffer) {
    dispose();
    return null;
  }
  gl.shaderSource(vertex, PARTICLE_VERTEX);
  gl.shaderSource(fragment, PARTICLE_FRAGMENT);
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
  const columnCount = columns ?? (canvas.clientWidth < 768 ? 64 : 96);
  const rows = Math.round(columnCount * 1.25);
  const points = new Float32Array(columnCount * rows * 5);
  let seed = 29;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  for (let y = 0; y < rows; y++)
    for (let x = 0; x < columnCount; x++) {
      const at = (y * columnCount + x) * 5;
      points.set([(x + 0.5) / columnCount, (y + 0.5) / rows, random(), random(), random()], at);
    }
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, points, gl.STATIC_DRAW);
  const uv = gl.getAttribLocation(program, 'a_uv');
  const seeds = gl.getAttribLocation(program, 'a_seed');
  gl.enableVertexAttribArray(uv);
  gl.enableVertexAttribArray(seeds);
  gl.vertexAttribPointer(uv, 2, gl.FLOAT, false, 20, 0);
  gl.vertexAttribPointer(seeds, 3, gl.FLOAT, false, 20, 8);
  gl.activeTexture(gl.TEXTURE0);
  const bind = (slot: number) => {
    let texture = textures.get(slot);
    if (texture) {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      return;
    }
    texture = gl.createTexture() ?? undefined;
    if (!texture) return;
    textures.set(slot, texture);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  };
  const uniforms = Object.fromEntries(
    ['resolution', 'rect', 'origin', 'progress', 'ratio', 'columns'].map((name) => [
      name,
      gl.getUniformLocation(program, `u_${name}`),
    ]),
  );
  gl.uniform1i(gl.getUniformLocation(program, 'u_image'), 0);
  gl.uniform1f(uniforms.columns!, columnCount);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  return {
    upload(image: TexImageSource, slot = 0) {
      bind(slot);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    },
    draw(
      anchor: PreviewAnchor,
      rect: PreviewPlacement,
      progress: number,
      { slot = 0, clear = true }: { slot?: number; clear?: boolean } = {},
    ) {
      const ratio = Math.min(
        window.devicePixelRatio || 1,
        TESSERACT.maxPixelRatio,
        TESSERACT.maxBufferSize / Math.max(anchor.width, anchor.height),
      );
      const width = Math.round(anchor.width * ratio),
        height = Math.round(anchor.height * ratio);
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      gl.viewport(0, 0, width, height);
      if (clear) {
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
      }
      bind(slot);
      gl.uniform2f(uniforms.resolution!, anchor.width, anchor.height);
      gl.uniform4f(uniforms.rect!, rect.left, rect.top, rect.width, rect.height);
      gl.uniform2f(uniforms.origin!, anchor.x, anchor.y);
      gl.uniform1f(uniforms.progress!, progress);
      gl.uniform1f(uniforms.ratio!, ratio);
      gl.drawArrays(gl.POINTS, 0, columnCount * rows);
    },
    clear() {
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
    },
    dispose,
  };
}
