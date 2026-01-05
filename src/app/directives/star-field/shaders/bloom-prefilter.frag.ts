export const BLOOM_PREFILTER_FRAG = `#version 300 es
precision highp float;

uniform sampler2D uScene;
uniform float uThreshold;

in vec2 vUV;
out vec4 outColor;

void main() {
  vec3 color = texture(uScene, vUV).rgb;
  float brightness = max(max(color.r, color.g), color.b);

  float a = brightness > uThreshold ? brightness : 0.0;
  outColor = vec4(color * a, a);

}
`;