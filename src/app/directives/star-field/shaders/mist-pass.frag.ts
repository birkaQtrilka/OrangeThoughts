export const MIST_FRAG = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 FragColor;

uniform sampler2D uSceneTex;
uniform float uTime;
uniform float uScroll;
uniform vec2 uResolution;
uniform vec3 uColor;
uniform float uAlpha;

float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }

float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
        mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
        mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
        f.y
    );
}

float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 3; ++i) {
        v += a * noise(p);
        p = p * 2.03 + vec2(17.1, 9.2); // offset avoids octaves lining up
        a *= 0.5;
    }
    return v;
}

void main() {
    vec3 scene = texture(uSceneTex, vUv).rgb;

    vec2 p = vUv * vec2(uResolution.x / uResolution.y, 1.0) * 3.0;
    p += vec2(-uTime * 0.02, -(uTime * 0.01) - uScroll * 2.0);

    float density = smoothstep(0.2, 0.8, fbm(p)) * uAlpha;
    FragColor = vec4(scene + uColor * density, 1.0);
}`;