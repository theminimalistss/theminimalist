import { NOISE_GLSL } from '@/shaders/noise';

export const MENU_MORPH_SHADER = `
precision mediump float;

uniform vec2 u_resolution;
uniform vec2 u_origin;
uniform float u_progress;
uniform float u_time;
uniform vec3 u_brand;
uniform vec3 u_lead;

${NOISE_GLSL}

void main() {
  vec2 frag = gl_FragCoord.xy;
  vec2 res = u_resolution;
  float reach = max(
    max(length(u_origin), length(u_origin - vec2(res.x, 0.0))),
    max(length(u_origin - vec2(0.0, res.y)), length(u_origin - res))
  );
  vec2 offset = frag - u_origin;
  float dist = length(offset) / reach;
  vec2 direction = offset / max(length(offset), 1.0);

  float swell = sin(u_progress * 3.14159) * smoothstep(0.0, 0.45, u_progress);
  float lobes = noise(direction * 1.6 + vec2(u_time * 0.35, -u_time * 0.25)) - 0.5;
  float ripple = fbm(offset / reach * 2.4 + u_time * 0.2) - 0.5;
  float warp = (lobes * 0.36 + ripple * 0.1) * swell;
  float edge = 1.5 / reach;

  float leadRadius = u_progress * 1.35;
  float brandRadius = max(u_progress * 1.45 - 0.2, 0.0);
  float lead = 1.0 - smoothstep(leadRadius - edge, leadRadius + edge, dist + warp);
  float brand = 1.0 - smoothstep(brandRadius - edge, brandRadius + edge, dist + warp * 1.3);

  float alpha = max(lead, brand);
  vec3 color = mix(u_lead, u_brand, brand);
  gl_FragColor = vec4(color * alpha, alpha);
}
`;
