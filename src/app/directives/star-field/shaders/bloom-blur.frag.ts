export const BLOOM_BLUR_FRAG = `#version 300 es
precision highp float;

uniform sampler2D uTexture;
uniform vec2 uDirection;   // (1,0) or (0,1)
uniform vec2 uResolution;
uniform float spread;
in vec2 vUV;
out vec4 outColor;

void main() {
  vec2 texel = 1.0 / uResolution;

  vec4 result = texture(uTexture, vUV) * 0.227027;
  result += texture(uTexture, vUV + uDirection * texel * 1.384615 * spread) * 0.316216;
  result += texture(uTexture, vUV - uDirection * texel * 1.384615 * spread) * 0.316216;
  result += texture(uTexture, vUV + uDirection * texel * 3.230769 * spread) * 0.070270;
  result += texture(uTexture, vUV - uDirection * texel * 3.230769 * spread) * 0.070270;

  outColor = result;
}
`;