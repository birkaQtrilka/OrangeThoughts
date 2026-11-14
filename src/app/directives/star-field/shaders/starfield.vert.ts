export const VERT = `#version 300 es
precision highp float;

layout(location=0) in vec2 quad;
layout(location=1) in vec2 position;
layout(location=2) in float size;
layout(location=3) in float speed;
layout(location=4) in float phase;
layout(location=5) in float spriteIndex;

uniform vec2 uResolution;
uniform float uTime;
uniform float uScroll;
uniform vec2 uSpriteGrid; // (columns, rows)

out float vAlpha;
out vec2 vUV;

void main() {
  float t = uTime * speed + phase;
  float sinT = sin(t);
  float cosT = cos(t);
  float twinkle = abs(sinT);

  mat2 r = mat2(cosT, -sinT, sinT, cosT);

  float y = position.y - uScroll * size * 2.0;
  y = mod(y + uResolution.y, uResolution.y);
  vec2 pos = vec2(position.x, y);
  vec2 p = r * quad * size * twinkle + pos;

  vec2 clip = (p / uResolution) * 2.0 - 1.0;
  gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);

  vAlpha = twinkle;

  // Pick the cell in the sheet. Row 0 is the top row, matching the image layout.
  float idx = floor(spriteIndex + 0.5);
  vec2 cell = vec2(mod(idx, uSpriteGrid.x), floor(idx / uSpriteGrid.x));
  vec2 local = quad + 0.5; // 0..1 across the (unrotated) quad
  vUV = (cell + local) / uSpriteGrid;
}
`;