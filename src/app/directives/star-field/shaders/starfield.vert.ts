export const VERT = `#version 300 es
precision highp float;

layout(location=0) in vec2 quad;
layout(location=1) in vec2 position;
layout(location=2) in float size;
layout(location=3) in float speed;
layout(location=4) in float phase;

uniform vec2 uResolution;
uniform float uTime;
uniform float uScroll;

out float vAlpha;
out vec2 vUV;
out float vRot;

void main() {
  float t = uTime * speed + phase;
  float twinkle = sin(t);

  mat2 r = mat2(cos(t), -sin(t), sin(t), cos(t));

  float y = position.y - uScroll * size * 2.0;
  y = mod(y + uResolution.y, uResolution.y);
  vec2 pos = vec2(position.x, y);
  vec2 p = r * quad * size * twinkle + pos;

  vec2 clip = (p / uResolution) * 2.0 - 1.0;
  gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);

  vAlpha = twinkle;
  vUV = r * quad;
}
`;