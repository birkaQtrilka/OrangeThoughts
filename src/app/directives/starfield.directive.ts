import { Directive, Input, NgZone, OnDestroy, OnInit } from '@angular/core';

const VERT = `#version 300 es
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

const FRAG = `#version 300 es
precision highp float;

in float vAlpha;
in vec2 vUV;

out vec4 outColor;

void main() {
  outColor = vec4(vec3(vAlpha), vAlpha);
}
`;

const POST_VERT = `#version 300 es
precision highp float;

out vec2 vUV;

void main() {
  vec2 pos = vec2(
    (gl_VertexID == 1) ? 3.0 : -1.0,
    (gl_VertexID == 2) ? 3.0 : -1.0
  );
  vUV = pos * 0.5 + 0.5;
  gl_Position = vec4(pos, 0.0, 1.0);
}
`;

const POST_FRAG = `#version 300 es
precision highp float;

uniform sampler2D uScene;
uniform sampler2D uBloom;
uniform float uBloomStrength;

in vec2 vUV;
out vec4 outColor;

void main() {
vec4 scene = texture(uScene, vUV);
vec4 bloom = texture(uBloom, vUV) * uBloomStrength;

vec4 outCol = scene + bloom;
outColor = vec4(outCol.rgb, outCol.a);

}
`;


const BLOOM_PREFILTER_FRAG = `#version 300 es
precision highp float;

uniform sampler2D uScene;
uniform float uThreshold;

in vec2 vUV;
out vec4 outColor;

void main() {
vec3 color = texture(uScene, vUV).rgb;
float brightness = max(max(color.r, color.g), color.b);

float a = brightness > uThreshold ? brightness : 0.0;
outColor = vec4(color * a, a);

}
`;

const BLOOM_BLUR_FRAG = `#version 300 es
precision highp float;

uniform sampler2D uTexture;
uniform vec2 uDirection;   // (1,0) or (0,1)
uniform vec2 uResolution;
uniform float spread;
in vec2 vUV;
out vec4 outColor;

void main() {
  vec2 texel = 1.0 / uResolution;

vec4 result = texture(uTexture, vUV) * 0.227027;
result += texture(uTexture, vUV + uDirection * texel * 1.384615 * spread) * 0.316216;
result += texture(uTexture, vUV - uDirection * texel * 1.384615 * spread) * 0.316216;
result += texture(uTexture, vUV + uDirection * texel * 3.230769 * spread) * 0.070270;
result += texture(uTexture, vUV - uDirection * texel * 3.230769 * spread) * 0.070270;

outColor = result;

}
`;


@Directive({
  selector: '[appStarfield]',
  standalone: true,
})
export class StarfieldDirective implements OnInit, OnDestroy {
  @Input() starCount = 500;
  @Input() parallax = 0.007;

  private canvas!: HTMLCanvasElement;
  private gl!: WebGL2RenderingContext;
  private program!: WebGLProgram;
  private postProgram!: WebGLProgram;

  private fbo!: WebGLFramebuffer;
  private colorTex!: WebGLTexture;

  private animationId = 0;

  private positions!: Float32Array;
  private posBuffer!: WebGLBuffer;
  private bloomPrefilterProgram!: WebGLProgram;
  private bloomBlurProgram!: WebGLProgram;

  private bloomFBOs: WebGLFramebuffer[] = [];
  private bloomTextures: WebGLTexture[] = [];

  constructor(private zone: NgZone) { }

  ngOnInit(): void {
    this.createCanvas();
    this.initGL();
    this.resize();
    this.zone.runOutsideAngular(() => this.animate());
  }


  ngOnDestroy(): void {
    cancelAnimationFrame(this.animationId);
    window.removeEventListener('resize', this.resize);
    this.canvas.remove();
  }

  private createCanvas() {
    this.canvas = document.createElement('canvas');
    Object.assign(this.canvas.style, {
      position: 'fixed',
      inset: '0',
      pointerEvents: 'none',
    });

    document.body.querySelector('.wrapper')?.prepend(this.canvas);

    const gl = this.canvas.getContext('webgl2', { alpha: true });
    if (!gl) throw new Error('WebGL2 not supported');
    this.gl = gl;

    window.addEventListener('resize', this.resize);
  }

  private resize = () => {
    const dpr = devicePixelRatio || 1;
    this.canvas.width = innerWidth * dpr;
    this.canvas.height = innerHeight * dpr;
    this.canvas.style.width = innerWidth + 'px';
    this.canvas.style.height = innerHeight + 'px';

    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);

    if (this.colorTex) {
      this.gl.bindTexture(this.gl.TEXTURE_2D, this.colorTex);
      this.gl.texImage2D(
        this.gl.TEXTURE_2D,
        0,
        this.gl.RGBA,
        this.canvas.width,
        this.canvas.height,
        0,
        this.gl.RGBA,
        this.gl.UNSIGNED_BYTE,
        null
      );

    }

    if (this.bloomTextures?.length) {
      for (const tex of this.bloomTextures) {
        this.gl.bindTexture(this.gl.TEXTURE_2D, tex);
        this.gl.texImage2D(
          this.gl.TEXTURE_2D,
          0,
          this.gl.RGBA,
          this.canvas.width,
          this.canvas.height,
          0,
          this.gl.RGBA,
          this.gl.UNSIGNED_BYTE,
          null
        );
      }
    }

    this.resetStarPositions();
  };

  private initGL() {
    const gl = this.gl;

    const program = this.createProgram(gl, VERT, FRAG);
    gl.useProgram(program);
    this.program = program;
    this.postProgram = this.createProgram(this.gl, POST_VERT, POST_FRAG);
    this.createFramebuffer();
    this.bloomPrefilterProgram = this.createProgram(this.gl, POST_VERT, BLOOM_PREFILTER_FRAG);
    this.bloomBlurProgram = this.createProgram(this.gl, POST_VERT, BLOOM_BLUR_FRAG);

    this.createBloomBuffers();

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const quad = new Float32Array([
      -0.5, -0.5,
      0.5, -0.5,
      -0.5, 0.5,
      0.5, 0.5,
    ]);

    this.positions = new Float32Array(this.starCount * 2);

    const sizes = new Float32Array(this.starCount);
    const speeds = new Float32Array(this.starCount);
    const phases = new Float32Array(this.starCount);

    for (let i = 0; i < this.starCount; i++) {
      sizes[i] = Math.random() * 10 + 2;
      speeds[i] = Math.random() * 0.3 + 0.1;
      phases[i] = Math.random() * Math.PI * 2;
    }

    this.resetStarPositions();

    // quad
    this.bindBuffer(gl, quad, 0, 2, 0);

    // positions
    this.posBuffer = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.posBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.positions, gl.DYNAMIC_DRAW);
    this.enableAttrib(1, 2, 1);

    this.bindBuffer(gl, sizes, 2, 1, 1);
    this.bindBuffer(gl, speeds, 3, 1, 1);
    this.bindBuffer(gl, phases, 4, 1, 1);
  }
  private createBloomBuffers() {
    const gl = this.gl;

    this.bloomFBOs = [];
    this.bloomTextures = [];

    for (let i = 0; i < 2; i++) {
      const tex = gl.createTexture()!;
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        this.canvas.width,
        this.canvas.height,
        0,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        null
      );
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

      const fbo = gl.createFramebuffer()!;
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(
        gl.FRAMEBUFFER,
        gl.COLOR_ATTACHMENT0,
        gl.TEXTURE_2D,
        tex,
        0
      );

      this.bloomTextures.push(tex);
      this.bloomFBOs.push(fbo);
    }

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }

  private createFramebuffer() {
    const gl = this.gl;

    this.colorTex = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, this.colorTex);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      this.canvas.width,
      this.canvas.height,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      null
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    this.fbo = gl.createFramebuffer()!;
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo);
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      this.colorTex,
      0
    );

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }


  private resetStarPositions() {
    if (!this.positions) return;

    for (let i = 0; i < this.starCount; i++) {
      this.positions[i * 2] = Math.random() * this.canvas.width;
      this.positions[i * 2 + 1] = Math.random() * this.canvas.height;
    }

    if (this.posBuffer) {
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.posBuffer);
      this.gl.bufferData(this.gl.ARRAY_BUFFER, this.positions, this.gl.DYNAMIC_DRAW);
    }
  }

  private animate = () => {
    const gl = this.gl;
    const time = performance.now() * 0.001;

    // ---------- PASS 1: render stars into framebuffer ----------
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo);
    gl.viewport(0, 0, this.canvas.width, this.canvas.height);

    // Clear FBO each frame
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Stars need blending
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    gl.useProgram(this.program);
    gl.uniform1f(gl.getUniformLocation(this.program, 'uTime'), time);
    gl.uniform1f(gl.getUniformLocation(this.program, 'uScroll'), window.scrollY * this.parallax);
    gl.uniform2f(gl.getUniformLocation(this.program, 'uResolution'), this.canvas.width, this.canvas.height);

    gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, this.starCount);

    // Fullscreen passes should NOT blend (avoid accumulation)
    gl.disable(gl.BLEND);

    // ---------- PASS 2: bloom prefilter ----------
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.bloomFBOs[0]);
    gl.viewport(0, 0, this.canvas.width, this.canvas.height);

    // Clear bloom target
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(this.bloomPrefilterProgram);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.colorTex);
    gl.uniform1i(gl.getUniformLocation(this.bloomPrefilterProgram, 'uScene'), 0);
    gl.uniform1f(gl.getUniformLocation(this.bloomPrefilterProgram, 'uThreshold'), 0.2);

    gl.drawArrays(gl.TRIANGLES, 0, 3);

    // ---------- PASS 3: blur horizontal ----------
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.bloomFBOs[1]);
    gl.viewport(0, 0, this.canvas.width, this.canvas.height);

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(this.bloomBlurProgram);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.bloomTextures[0]);
    gl.uniform1i(gl.getUniformLocation(this.bloomBlurProgram, 'uTexture'), 0);
    gl.uniform2f(gl.getUniformLocation(this.bloomBlurProgram, 'uDirection'), 1, 0);
    gl.uniform1f(gl.getUniformLocation(this.bloomBlurProgram, 'spread'), 3);
    gl.uniform2f(gl.getUniformLocation(this.bloomBlurProgram, 'uResolution'), this.canvas.width, this.canvas.height);

    gl.drawArrays(gl.TRIANGLES, 0, 3);

    // ---------- PASS 4: blur vertical ----------
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.bloomFBOs[0]);
    gl.viewport(0, 0, this.canvas.width, this.canvas.height);

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // same blur program, just different input + direction
    gl.useProgram(this.bloomBlurProgram);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.bloomTextures[1]);
    gl.uniform1i(gl.getUniformLocation(this.bloomBlurProgram, 'uTexture'), 0);
    gl.uniform1f(gl.getUniformLocation(this.bloomBlurProgram, 'spread'), 3);
    gl.uniform2f(gl.getUniformLocation(this.bloomBlurProgram, 'uDirection'), 0, 1);
    gl.uniform2f(gl.getUniformLocation(this.bloomBlurProgram, 'uResolution'), this.canvas.width, this.canvas.height);

    gl.drawArrays(gl.TRIANGLES, 0, 3);

    // ---------- PASS 5: composite ----------
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, this.canvas.width, this.canvas.height);

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(this.postProgram);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.colorTex);
    gl.uniform1i(gl.getUniformLocation(this.postProgram, 'uScene'), 0);

    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this.bloomTextures[0]);
    gl.uniform1i(gl.getUniformLocation(this.postProgram, 'uBloom'), 1);

    gl.uniform1f(gl.getUniformLocation(this.postProgram, 'uBloomStrength'), 1.2);

    gl.drawArrays(gl.TRIANGLES, 0, 3);

    this.animationId = requestAnimationFrame(this.animate);
  };

  private bindBuffer(gl: WebGL2RenderingContext, data: Float32Array, loc: number, size: number, divisor: number) {
    const buf = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    this.enableAttrib(loc, size, divisor);
  }

  private enableAttrib(loc: number, size: number, divisor: number) {
    const gl = this.gl;
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
    gl.vertexAttribDivisor(loc, divisor);
  }

  private createProgram(gl: WebGL2RenderingContext, vs: string, fs: string) {
    const v = gl.createShader(gl.VERTEX_SHADER)!;
    gl.shaderSource(v, vs);
    gl.compileShader(v);
    if (!gl.getShaderParameter(v, gl.COMPILE_STATUS)) {
      console.error('Vertex shader error:', gl.getShaderInfoLog(v));
      throw new Error('Vertex shader failed');
    }

    const f = gl.createShader(gl.FRAGMENT_SHADER)!;
    gl.shaderSource(f, fs);
    gl.compileShader(f);
    if (!gl.getShaderParameter(f, gl.COMPILE_STATUS)) {
      console.error('Fragment shader error:', gl.getShaderInfoLog(f));
      throw new Error('Fragment shader failed');
    }

    const p = gl.createProgram()!;
    gl.attachShader(p, v);
    gl.attachShader(p, f);
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(p));
      throw new Error('Program link failed');
    }

    return p;
  }

}
