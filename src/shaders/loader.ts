import { NOISE_GLSL } from '@/shaders/noise';

export const LOADER_SHADER = `
precision mediump float;

uniform vec2 u_resolution;
uniform sampler2D u_logo;
uniform vec4 u_logoRect;
uniform vec2 u_logoBase;
uniform float u_logoReach;
uniform vec2 u_logoTexel;
uniform float u_time;
uniform float u_bloom;
uniform float u_exit;
uniform vec3 u_ink;
uniform vec3 u_base;
uniform vec3 u_deep;
uniform vec3 u_light;

${NOISE_GLSL}

void main() {
  vec2 frag = gl_FragCoord.xy;
  vec2 uv = frag / u_resolution;
  float aspect = u_resolution.x / u_resolution.y;
  vec2 p = (uv - 0.5) * vec2(aspect, 1.0);

  float light = smoothstep(1.3, 0.0, length(p - vec2(-0.3 * aspect, 0.35)));
  float drift = fbm(p * 1.6 + vec2(u_time * 0.035, -u_time * 0.02)) - 0.5;
  vec3 color = mix(u_deep, u_base, smoothstep(1.1, 0.2, length(p)));
  color = mix(color, u_light, clamp(light * 0.75 + drift * 0.35, 0.0, 1.0));

  float exitEase = u_exit * u_exit * (3.0 - 2.0 * u_exit);
  vec2 local = (frag - u_logoRect.xy) / u_logoRect.zw;
  local /= 1.0 + exitEase * 0.12;
  float wobble = (1.0 - u_bloom) * 0.01 + exitEase * 0.008;
  local += (vec2(noise(local * 7.0 + u_time * 0.8), noise(local * 7.0 - u_time * 0.7)) - 0.5) * wobble;
  vec2 logoUv = local + 0.5;

  float ink = 0.0;
  float halo = 0.0;
  if (abs(local.x) < 0.55 && abs(local.y) < 0.55) {
    ink = texture2D(u_logo, logoUv).a;
    for (int i = 0; i < 8; i++) {
      float angle = float(i) * 0.785398;
      vec2 ring = vec2(cos(angle), sin(angle)) * u_logoTexel;
      halo += texture2D(u_logo, logoUv + ring * 3.0).a;
      halo += texture2D(u_logo, logoUv + ring * 7.0).a * 0.6;
    }
    halo /= 12.8;
  }

  vec2 fromBase = (logoUv - u_logoBase) * vec2(u_logoRect.z / u_logoRect.w, 1.0);
  float order = length(fromBase) / u_logoReach + (fbm(logoUv * 9.0) - 0.5) * 0.18;
  float front = u_bloom * 1.25;
  float revealed = smoothstep(front, front - 0.12, order);
  float crest = smoothstep(0.1, 0.0, abs(order - front + 0.04)) * (1.0 - smoothstep(0.95, 1.0, u_bloom));

  float sweep = logoUv.x * 0.8 + logoUv.y * 0.35 - (fract(u_time / 2.8) * 1.8 - 0.4);
  float sheen = exp(-sweep * sweep * 90.0) * u_bloom;
  float breathe = 0.5 + 0.5 * sin(u_time * 2.2);
  float fade = 1.0 - smoothstep(0.15, 0.55, u_exit);

  vec3 inkColor = u_ink * (0.84 + 0.16 * breathe) + sheen * 0.35 + crest * 0.6 + exitEase * 0.25;
  color = mix(color, inkColor, ink * revealed * fade);
  color += u_ink * halo * revealed * fade * (0.08 + 0.06 * breathe + sheen * 0.25 + exitEase * 0.5);
  color += (hash(frag + fract(u_time) * 100.0) - 0.5) * 0.018;

  float opening = smoothstep(0.15, 1.0, u_exit);
  opening = opening * opening * (3.0 - 2.0 * opening);
  vec2 fromCenter = (frag - u_logoRect.xy) / (0.5 * length(u_resolution));
  float radial = length(fromCenter);
  vec2 direction = fromCenter / max(radial, 0.0001);
  float warp = (noise(direction * 2.0 + u_time * 0.4) - 0.5) * 0.3 * sin(opening * 3.14159);
  float radius = mix(-0.15, 1.3, opening);
  float alpha = smoothstep(radius - 0.008, radius + 0.012, radial + warp);
  float rim = smoothstep(0.02, 0.0, abs(radial + warp - radius - 0.012)) * sin(opening * 3.14159);
  color = mix(color, u_ink, rim * 0.25);

  gl_FragColor = vec4(color * alpha, alpha);
}
`;
