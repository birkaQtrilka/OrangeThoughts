export const POST_FRAG = `#version 300 es
precision highp float;

uniform sampler2D uScene;
uniform sampler2D uBloom;
uniform float uBloomStrength;

in vec2 vUV;
out vec4 outColor;

void main() {
  vec4 scene = texture(uScene, vUV);
  vec4 bloom = texture(uBloom, vUV) * uBloomStrength;

  vec4 outCol = scene + bloom;
  outColor = vec4(outCol.rgb, outCol.a);

}
`;