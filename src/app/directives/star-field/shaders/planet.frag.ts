export const PLANET_FRAG = `#version 300 es
precision highp float;

uniform sampler2D uScene;
uniform float scrollY;

in vec2 vUV;
out vec4 outColor;

void main() {
  vec3 color = texture(uScene, vUV).rgb;
  outColor = vec4(color.x, color.y, color.z, 1);

  vec3 planetPos = vec3(0.5, .2 - scrollY * 0.001, 1);
  float planetR = 0.2;
  vec3 cameraDir = vec3(0.0,0.0,1.0);
  vec3 lightPos = vec3(2, 1, 1);

  vec3 ray = normalize(vec3(vUV.x, vUV.y, 0.0) + cameraDir);
  
  vec3 planetToCam = -planetPos; // because camPos is 0,0
  // b from quadratic formula
  float b = dot(planetToCam, ray);
  // using quadratic formula
  float discriminant = pow(b, 2.0) - dot(planetToCam, planetToCam) + pow(planetR, 2.0);

  if(discriminant <= 0.0) return;
  float sqrtDiscriminant = sqrt(discriminant);
  float nearIntersection = -b - sqrtDiscriminant;

  vec3 fragWorldPos = ray * nearIntersection;
  vec3 sphereNormal = normalize(fragWorldPos - planetPos);
  vec3 lightDir = normalize(lightPos - planetPos);
  float light = clamp(dot(sphereNormal, lightDir), 0.0, 1.0) + 0.1;

  outColor = vec4(light, light, light, 1.0);

}
`