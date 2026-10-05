export type Rgb = [number, number, number];

export type FullscreenScene = {
  gl: WebGLRenderingContext;
  uniform: (name: string) => WebGLUniformLocation | null;
  draw: () => void;
  clear: () => void;
  dispose: () => void;
};

const VERTEX_SHADER = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const MAX_PIXEL_RATIO = 2;

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
  gl.deleteShader(shader);
  return null;
}

export function createFullscreenScene(
  canvas: HTMLCanvasElement,
  fragmentSource: string,
): FullscreenScene | null {
  const gl = canvas.getContext('webgl', {
    alpha: true,
    premultipliedAlpha: true,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: 'low-power',
  });
  if (!gl || gl.isContextLost()) return null;
  const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
  const fragment = compile(gl, gl.FRAGMENT_SHADER, fragmentSource);
  const program = gl.createProgram();
  if (!vertex || !fragment || !program) return null;
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    return null;
  }

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  gl.useProgram(program);
  const position = gl.getAttribLocation(program, 'a_position');
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

  const uniforms = new Map<string, WebGLUniformLocation | null>();
  return {
    gl,
    uniform(name) {
      if (!uniforms.has(name)) uniforms.set(name, gl.getUniformLocation(program, name));
      return uniforms.get(name) ?? null;
    },
    draw() {
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    },
    clear() {
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
    },
    dispose() {
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    },
  };
}

export function getPixelRatio() {
  return Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO);
}

export function fitCanvas(canvas: HTMLCanvasElement, width: number, height: number) {
  const ratio = getPixelRatio();
  const pixelWidth = Math.max(1, Math.round(width * ratio));
  const pixelHeight = Math.max(1, Math.round(height * ratio));
  if (canvas.width === pixelWidth && canvas.height === pixelHeight) return false;
  canvas.width = pixelWidth;
  canvas.height = pixelHeight;
  return true;
}

export function hexToRgb(hex: string): Rgb {
  const value = Number.parseInt(hex.trim().replace('#', '').slice(0, 6), 16);
  if (Number.isNaN(value)) return [0, 0, 0];
  return [((value >> 16) & 255) / 255, ((value >> 8) & 255) / 255, (value & 255) / 255];
}

export function readColorToken(name: string): Rgb {
  return hexToRgb(getComputedStyle(document.documentElement).getPropertyValue(name));
}
