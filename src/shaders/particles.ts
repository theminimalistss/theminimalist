export const PARTICLE_VERTEX = `
precision mediump float;
attribute vec2 a_uv;
attribute vec3 a_seed;
uniform vec2 u_resolution;
uniform vec4 u_rect;
uniform vec2 u_origin;
uniform float u_progress;
uniform float u_ratio;
uniform float u_columns;
varying vec2 v_uv;
varying float v_alpha;
void main() {
  float progress = smoothstep(a_seed.z * 0.22, 1.0, u_progress);
  vec2 target = u_rect.xy + a_uv * u_rect.zw;
  vec2 scatter = (a_seed.xy - 0.5) * vec2(390.0, 420.0);
  vec2 point = mix(u_origin, target, progress) + scatter * sin(progress * 3.14159);
  vec2 clip = point / u_resolution * 2.0 - 1.0;
  gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
  gl_PointSize = mix(1.7, u_rect.z / u_columns + 0.6, progress) * u_ratio;
  v_uv = a_uv;
  v_alpha = smoothstep(0.0, 0.14, progress);
}
`;
export const PARTICLE_FRAGMENT = `
precision mediump float;
uniform sampler2D u_image;
uniform float u_progress;
varying vec2 v_uv;
varying float v_alpha;
void main() {
  float circle = 1.0 - smoothstep(0.35, 0.5, length(gl_PointCoord - 0.5));
  float shape = mix(circle, 1.0, smoothstep(0.85, 1.0, u_progress));
  vec4 sampleColor = texture2D(u_image, v_uv);
  float alpha = v_alpha * shape;
  gl_FragColor = vec4(sampleColor.rgb * alpha, alpha);
}
`;
