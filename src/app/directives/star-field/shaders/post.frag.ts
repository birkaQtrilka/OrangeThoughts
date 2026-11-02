export const POST_FRAG = `#version 300 es
precision highp float;

uniform sampler2D uScene;
uniform sampler2D uBloom;
uniform float uBloomStrength;

in vec2 vUV;
out vec4 outColor;
float ign(vec2 p) {
    return fract(52.9829189 * fract(dot(p, vec2(0.06711056, 0.00583715))));
}
    
void main() {
  vec4 scene = texture(uScene, vUV);
  vec4 bloom = texture(uBloom, vUV) * uBloomStrength;

  vec4 outCol = scene + bloom;
  outColor = vec4(outCol.rgb, outCol.a);
  float dn = ign(gl_FragCoord.xy) + ign(gl_FragCoord.xy + 5.588238) - 1.0; // triangular, -1..1
  outColor.rgb += dn / 255.0;
}
`;