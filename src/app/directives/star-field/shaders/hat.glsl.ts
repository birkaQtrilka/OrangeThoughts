export const HAT_VERT = `#version 300 es
precision highp float;

layout(location = 0) in vec3 aPos;
layout(location = 1) in vec3 aNormal;
layout(location = 2) in vec2 aUV;

uniform mat4 uModel;   // hat -> "scene space" (shader space with z negated)
uniform float uAspect;

out vec3 vWorld;
out vec3 vNormal;
out vec2 vUV;

const float N = 0.01;
const float F = 20.0;

void main() {
  vec4 w = uModel * vec4(aPos, 1.0);
  vWorld = w.xyz;
  vNormal = mat3(uModel) * aNormal; // uniform scale, so no inverse-transpose needed
  vUV = aUV;

  // Same camera as planet.frag: x/z = cx*aspect, y/z = cy, with cx, cy in [-0.5, 0.5].
  float z = -w.z; // forward distance in shader space
  gl_Position = vec4(
    2.0 * w.x / uAspect,
    2.0 * w.y,
    (F + N) / (F - N) * z - 2.0 * F * N / (F - N),
    z
  );
}
`;

export const HAT_FRAG = `#version 300 es
precision highp float;
precision highp sampler2D;

in vec3 vWorld;
in vec3 vNormal;
in vec2 vUV;

uniform sampler2D uTex;     // SRGB8_ALPHA8, so sampling returns linear
uniform vec3 uLightDir;     // scene space, towards the light
uniform vec4 uPlanet;       // shader-space centre.xyz, radius
uniform vec4 uMoon;
uniform float uAmbient;
uniform float uKey;

out vec4 outColor;

float sphereHit(vec3 dir, vec4 s) {
  float b = -dot(s.xyz, dir);
  float c = dot(s.xyz, s.xyz) - s.w * s.w;
  float d = b * b - c;
  return d > 0.0 ? -b - sqrt(d) : 1e9;
}

vec3 linearToSrgb(vec3 c) {
  return mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(0.0031308, c));
}

void main() {
  // Analytic occlusion against the same spheres the planet shader raytraces.
  vec3 p = vec3(vWorld.xy, -vWorld.z);
  float tFrag = length(p);
  vec3 dir = p / tFrag;
  float t = min(sphereHit(dir, uPlanet), sphereHit(dir, uMoon));
  if (t > 0.0 && t < tFrag - 1e-4) discard;

  vec3 n = normalize(vNormal);
  float ndl = max(dot(n, uLightDir), 0.0);
  vec3 albedo = texture(uTex, vUV).rgb;
  vec3 lit = albedo * (uAmbient + uKey * ndl);
  outColor = vec4(linearToSrgb(lit), 1.0);
}
`;