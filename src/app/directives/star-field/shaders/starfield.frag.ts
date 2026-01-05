export const FRAG = `#version 300 es
precision highp float;

in float vAlpha;
in vec2 vUV;

out vec4 outColor;

void main() {
  outColor = vec4(vec3(vAlpha), vAlpha);
}
`;