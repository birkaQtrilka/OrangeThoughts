export const FRAG = `#version 300 es
precision highp float;

uniform sampler2D uSprite;

in float vAlpha;
in vec2 vUV;

out vec4 outColor;

void main() {
  // Sprite is premultiplied, so scaling the whole vec4 keeps it premultiplied
  outColor = texture(uSprite, vUV) * vAlpha;
}
`;