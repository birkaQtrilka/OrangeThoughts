export const PLANET_FRAG = `#version 300 es
precision highp float;

uniform sampler2D uScene;
uniform highp sampler3D uNoise3D; 
uniform float scrollY;
uniform vec2 uResolution;
uniform vec3 lightPos;
uniform vec3 cameraDir; 
uniform float scrollSpeed;
uniform float planetR;
uniform vec3 planetPos;
uniform float fadeThreshold;
uniform float fadeDistance;
uniform float outerRadius;
uniform float noiseDensity;

in vec2 vUV;
out vec4 outColor;


void main() {
  float Yoffset = scrollY * scrollSpeed;
  vec3 planetOffsetPos = planetPos + vec3(0.0,  Yoffset, 0.0);


  vec3 color = texture(uScene, vUV).rgb;
  outColor = vec4(color, 0.0); 
  
  float aspect = uResolution.x / uResolution.y;
  // Moves (0.5, 0.5) to (0, 0) and applies the aspect ratio to X
  vec2 centeredUV = vUV - 0.5;
  centeredUV.x *= aspect;

  vec3 ray = normalize(vec3(centeredUV.x, centeredUV.y, 0.0) + cameraDir);

  vec3 planetToCam = -planetOffsetPos; // because camPos is 0,0
  // b from quadratic formula
  float b = dot(planetToCam, ray);
  // using quadratic formula
  float bb = b * b;
  float d = dot(planetToCam, planetToCam);
  float discriminant = bb - d + pow(planetR, 2.0);
  float atmosDiscriminant = bb - d + pow(outerRadius, 4.0);
  vec4 atmosColor = vec4(.7,.3,.0,1.0);


  if(discriminant > 0.0) {
  
    float sqrtDiscriminant = sqrt(discriminant);
    float nearIntersection = -b - sqrtDiscriminant;

    vec3 fragWorldPos = ray * nearIntersection;
    vec3 sphereNormal = normalize(fragWorldPos - planetOffsetPos);
    vec3 lightDir = normalize(lightPos - planetOffsetPos);
    float light = clamp(dot(sphereNormal, lightDir), 0.0, 1.0);
    vec3 fragLocalPos = fragWorldPos - vec3(0.0, Yoffset, 0.0);
    float nRaw = texture(uNoise3D, fragLocalPos * noiseDensity).r;
    float n = nRaw * 2.0 - 1.0;

    if(n < 0.2) {
      if(n < -0.2) {  
        n += 1.7;
        // Darkest brown (Red: 0.12, Green: 0.06, Blue: 0.01)
        outColor = vec4(0.20 * n, 0.10 * n, 0.02 * n, 1.0);
        }
        else {
          n += 1.0;
        // Slightly lighter dark brown (Red: 0.2, Green: 0.1, Blue: 0.02)
        outColor = vec4(0.12 * n, 0.06 * n, 0.01 * n, 1.0);
      }

    }
    else{
      // if( n < 0.08){
          // n += 1.5;
          // outColor = vec4(0.15 * n, .15 * n, 0, 1.0);
        // }
        // else {
          n += 1.4;
          outColor = vec4(.3 * n, .161 * n, 0.0, 1.0);
        // }

    }
    outColor = light * outColor +  atmosColor *.1 * light;
    
  }

  if(atmosDiscriminant > 0.0) {

    float a_sqrtDiscriminant = sqrt(atmosDiscriminant);
    float a_nearIntersection = -b - a_sqrtDiscriminant;
    float a_farIntersection = -b + a_sqrtDiscriminant;
    float planetFragDistance = -b - sqrt(discriminant);

    a_farIntersection = min(a_farIntersection, planetFragDistance); // linearDepth is where the ray is hitting the planet
                
    float diff = (a_farIntersection-a_nearIntersection);
    diff /= outerRadius;                 

    vec3 fragWorldPos = ray * a_nearIntersection;
    vec3 sphereNormal = normalize(fragWorldPos - planetOffsetPos);
    vec3 lightDir = normalize(lightPos - planetOffsetPos);
    float light = clamp(dot(sphereNormal, lightDir), 0.0, 1.0);

    outColor += atmosColor * pow(diff, 4.0) * 3.0 * light;
    // float distanceToFrag = length(fragWorldPos);

    // if(distanceToFrag > fadeThreshold){
    //   float fade = (1.0 - (distanceToFrag - fadeThreshold)) * fadeDistance;
    //   fade = clamp(fade, 0.0, 1.0) ;
    //   outColor *= fade;
    // }
  }
}
`