export const TESSERACT_VERTEX = `
attribute vec2 a_position;
attribute vec2 a_detail;
varying vec2 v_detail;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
  v_detail = a_detail;
}
`;

export const TESSERACT_FRAGMENT = `
precision mediump float;
varying vec2 v_detail;
uniform vec3 u_color;
void main() {
  if (v_detail.x > 1.5) {
    float alpha = v_detail.y * 0.035;
    gl_FragColor = vec4(u_color * alpha, alpha);
    return;
  }
  float distance = abs(v_detail.x);
  float core = 1.0 - smoothstep(0.1, 0.32, distance);
  float glow = (1.0 - distance) * (1.0 - distance) * 0.06;
  float alpha = (core * 0.82 + glow) * v_detail.y;
  gl_FragColor = vec4(u_color * alpha, alpha);
}
`;
