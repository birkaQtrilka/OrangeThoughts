export const PLANET_FRAG = `#version 300 es
precision lowp float;

uniform sampler2D uScene;
uniform mediump sampler3D uNoise3D;
uniform highp sampler3D voronoi;
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
mat3 rotationY(float angle)
{
    float c = cos(angle);
    float s = sin(angle);

    return mat3(
        c,   0.0, s,
        0.0, 1.0, 0.0,
        -s,  0.0, c
    );
}

void Moon(vec3 ray, vec3 moonPos, float moonR, vec3 lightPos, out bool hit, out float dist, out vec4 color) {
    vec3 moonToCam = -moonPos;
    float b = dot(moonToCam, ray);
    float c = dot(moonToCam, moonToCam) - moonR * moonR;
    float discriminant = b * b - c;
    
    hit = discriminant > 0.0;
    dist = hit ? -b - sqrt(discriminant) : 999999.0;
    
    if (hit) {
        vec3 fragWorldPos = ray * dist;
        vec3 sphereNormal = normalize(fragWorldPos - moonPos);
        vec3 lightDir = normalize(lightPos - moonPos);
        float light = clamp(dot(sphereNormal, lightDir), 0.0, 1.0);
        
        vec3 fragLocalPos = fragWorldPos - moonPos;
        fragLocalPos = rotationY(-time * 0.07) * fragLocalPos;
        
        vec4 vTex = texture(voronoi, fragLocalPos * noiseDensity * 3.2);
        
        vec3 cellColor = vTex.rgb;
        
        // Set the terrain to the flat cell color
        float gray = dot(cellColor, vec3(0.333));
        vec3 craterDark = vec3(0.15, 0.15, 0.17);
        vec3 surfaceLight = vec3(0.50, 0.50, 0.52);
        vec3 terrain = mix(craterDark, surfaceLight, gray);   

        float ambient = 0.1;
        color = vec4(terrain * (light + ambient), 1.0);
    } else {
        color = vec4(0.0);
    }
}

void main() {
  float Yoffset = scrollY * scrollSpeed;
  vec3 planetOffsetPos = planetPos + vec3(0.0, Yoffset, 0.0);

  vec3 sceneColor = texture(uScene, vUV).rgb;
  outColor = vec4(sceneColor, 0.0);

  float aspect = uResolution.x / uResolution.y;
  vec2 centeredUV = vUV - 0.5;
  centeredUV.x *= aspect;

  vec3 ray = normalize(vec3(centeredUV.x, centeredUV.y, 0.0) + cameraDir);
  vec4 atmosColor = vec4(0.7, 0.3, 0.0, 1.0);

  vec3 planetToCam = -planetOffsetPos; // camPos is (0,0,0)
  float b = dot(planetToCam, ray);
  float bb = b * b;
  float d = dot(planetToCam, planetToCam);

  float planetR2 = planetR * planetR;
  float discriminant = bb - d + planetR2;
  
  bool hitPlanet = discriminant > 0.0;
  float planetFragDistance = hitPlanet ? -b - sqrt(discriminant) : 999999.0;


  float moonR = planetR * 0.1;
  float orbitRadius = planetR * 1.9;
  float orbitSpeed = 0.02;
  
  // MOON ORBIT
  vec3 moonOffset = vec3(
      cos(time * orbitSpeed) * orbitRadius,
      sin(time * orbitSpeed) * orbitRadius * 1.25, // slight Y tilt to orbit
      sin(time * orbitSpeed) * orbitRadius
  );
  vec3 moonPos = planetOffsetPos + moonOffset;
  
  bool hitMoon;
  float moonFragDistance;
  vec4 moonColor;
  Moon(ray, moonPos, moonR, lightPos, hitMoon, moonFragDistance, moonColor);


  float closestSurfaceDist = min(planetFragDistance, moonFragDistance);
  bool drawPlanet = hitPlanet && (closestSurfaceDist == planetFragDistance);
  bool drawMoon = hitMoon && (closestSurfaceDist == moonFragDistance);

  if (drawPlanet) {
    vec3 fragWorldPos = ray * planetFragDistance;
    vec3 sphereNormal = normalize(fragWorldPos - planetOffsetPos);
    vec3 lightDir = normalize(lightPos - planetOffsetPos);
    float light = clamp(dot(sphereNormal, lightDir), 0.0, 1.0);

    vec3 fragLocalPos = fragWorldPos - planetOffsetPos;
    fragLocalPos = rotationX(time * 0.01) * fragLocalPos;
    float nRaw = texture(uNoise3D, fragLocalPos * noiseDensity).r;
    float n = nRaw * 2.0 - 1.0;

    // Branchless terrain color blend
    float band1 = step(-0.2, n);
    float band2 = step(0.2, n); 

    vec3 darkest = vec3(0.20, 0.10, 0.02) * (n + 1.7);
    vec3 mid     = vec3(0.12, 0.06, 0.01) * (n + 1.0);
    vec3 lightC  = vec3(0.30, 0.161, 0.0) * (n + 1.4);

    vec3 terrain = mix(mix(darkest, mid, band1), lightC, band2);

    vec4 surfaceColor = vec4(terrain, 1.0);
    outColor = light * surfaceColor + atmosColor * 0.1 * light;
    
  } else if (drawMoon) {
    outColor = moonColor;
  }


  // ATMOSPHERE RENDERING 
  float atmosDiscriminant = bb - d + outerRadius * outerRadius;

  if (atmosDiscriminant > 0.0) {
    float a_sqrtDiscriminant = sqrt(atmosDiscriminant);
    float a_nearIntersection = -b - a_sqrtDiscriminant;
    float a_farIntersection = -b + a_sqrtDiscriminant;

    if (closestSurfaceDist < 999999.0) {
      a_farIntersection = min(a_farIntersection, closestSurfaceDist);
    }
    
    float diff = max(0.0, a_farIntersection - a_nearIntersection) / outerRadius;
    
    float diff2 = diff * diff;
    float diff4 = diff2 * diff2;

    vec3 fragWorldPos = ray * a_nearIntersection;
    vec3 sphereNormal = normalize(fragWorldPos - planetOffsetPos);
    vec3 lightDir = normalize(lightPos - planetOffsetPos);
    float light = clamp(dot(sphereNormal, lightDir), 0.0, 1.0);

    outColor += atmosColor * diff4 * 3.0 * light;
  }
}
`;