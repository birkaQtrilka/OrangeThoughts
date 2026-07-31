export const PLANET_FRAG = `#version 300 es
precision lowp float;

uniform sampler2D uScene;
uniform mediump sampler3D uNoise3D;
uniform float scrollY;
uniform vec2 uResolution;
uniform vec3 lightPos;
uniform vec3 cameraDir;
uniform float scrollSpeed;
uniform float planetR;
uniform vec3 planetPos;
uniform float outerRadius;
uniform float noiseDensity;
uniform float time;

in vec2 vUV;
out vec4 outColor;

mat3 rotationX(float angle)
{
    float c = cos(angle);
    float s = sin(angle);

    return mat3(
        1.0, 0.0, 0.0,
        0.0, c,  -s,
        0.0, s,   c
    );
}

void main() {
  float Yoffset = scrollY * scrollSpeed;
  vec3 planetOffsetPos = planetPos + vec3(0.0, Yoffset, 0.0);

  vec3 sceneColor = texture(uScene, vUV).rgb;
  outColor = vec4(sceneColor, 0.0);

  float aspect = uResolution.x / uResolution.y;
  // Moves (0.5, 0.5) to (0, 0) and applies the aspect ratio to X
  vec2 centeredUV = vUV - 0.5;
  centeredUV.x *= aspect;

  vec3 ray = normalize(vec3(centeredUV.x, centeredUV.y, 0.0) + cameraDir);

  vec3 planetToCam = -planetOffsetPos; // camPos is (0,0,0)
  float b = dot(planetToCam, ray);
  float bb = b * b;
  float d = dot(planetToCam, planetToCam);

  float planetR2 = planetR * planetR;
  float discriminant = bb - d + planetR2;

  float atmosDiscriminant = bb - d + outerRadius * outerRadius;

  vec4 atmosColor = vec4(0.7, 0.3, 0.0, 1.0);

  // Precompute once, reused by both branches below
  bool hitPlanet = discriminant > 0.0;
  float sqrtDiscriminant = hitPlanet ? sqrt(discriminant) : 0.0;
  float planetFragDistance = -b - sqrtDiscriminant;

  if (hitPlanet) {
    vec3 fragWorldPos = ray * planetFragDistance;
    vec3 sphereNormal = normalize(fragWorldPos - planetOffsetPos);
    vec3 lightDir = normalize(lightPos - planetOffsetPos);
    float light = clamp(dot(sphereNormal, lightDir), 0.0, 1.0);

    vec3 fragLocalPos = fragWorldPos - planetOffsetPos;
    fragLocalPos = rotationX(time * 0.01) * fragLocalPos;
    float nRaw = texture(uNoise3D, fragLocalPos * noiseDensity).r;
    float n = nRaw * 2.0 - 1.0;

    // Branchless terrain color blend (avoids warp divergence from nested ifs)
    float band1 = step(-0.2, n); // 0 => darkest band, 1 => mid/light band
    float band2 = step(0.2, n);  // 0 => mid band,      1 => light band

    vec3 darkest = vec3(0.20, 0.10, 0.02) * (n + 1.7);
    vec3 mid     = vec3(0.12, 0.06, 0.01) * (n + 1.0);
    vec3 lightC  = vec3(0.30, 0.161, 0.0) * (n + 1.4);

    vec3 terrain = mix(mix(darkest, mid, band1), lightC, band2);

    vec4 surfaceColor = vec4(terrain, 1.0);
    outColor = light * surfaceColor + atmosColor * 0.1 * light;
  }

  if (atmosDiscriminant > 0.0) {
    float a_sqrtDiscriminant = sqrt(atmosDiscriminant);
    float a_nearIntersection = -b - a_sqrtDiscriminant;
    float a_farIntersection = -b + a_sqrtDiscriminant;

    // If we also hit the planet, clip the atmosphere ray at the planet surface
    a_farIntersection = hitPlanet
      ? min(a_farIntersection, planetFragDistance)
      : a_farIntersection;

    float diff = (a_farIntersection - a_nearIntersection) / outerRadius;
    float diff2 = diff * diff;
    float diff4 = diff2 * diff2; // replaces pow(diff, 2.0)

    vec3 fragWorldPos = ray * a_nearIntersection;
    vec3 sphereNormal = normalize(fragWorldPos - planetOffsetPos);
    vec3 lightDir = normalize(lightPos - planetOffsetPos);
    float light = clamp(dot(sphereNormal, lightDir), 0.0, 1.0);

    outColor += atmosColor * diff4 * 3.0 * light;
  }
}
`