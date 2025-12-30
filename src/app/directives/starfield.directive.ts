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
  outColor = vec4(1.0, 1.0, 1.0, vAlpha);
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
  private animationId = 0;

  private positions!: Float32Array;
  private posBuffer!: WebGLBuffer;

  constructor(private zone: NgZone) {}

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
    this.canvas.width  = innerWidth * dpr;
    this.canvas.height = innerHeight * dpr;
    this.canvas.style.width  = innerWidth + 'px';
    this.canvas.style.height = innerHeight + 'px';

    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    this.resetStarPositions();
  };

  private initGL() {
    const gl = this.gl;

    const program = this.createProgram(gl, VERT, FRAG);
    gl.useProgram(program);
    this.program = program;

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const quad = new Float32Array([
      -0.5, -0.5,
       0.5, -0.5,
      -0.5,  0.5,
       0.5,  0.5,
    ]);

    this.positions = new Float32Array(this.starCount * 2);

    const sizes  = new Float32Array(this.starCount);
    const speeds = new Float32Array(this.starCount);
    const phases = new Float32Array(this.starCount);

    for (let i = 0; i < this.starCount; i++) {
      sizes[i]  = Math.random() * 10 + 2;
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

  private resetStarPositions() {
    if (!this.positions) return;
    
    for (let i = 0; i < this.starCount; i++) {
      this.positions[i * 2]     = Math.random() * this.canvas.width;
      this.positions[i * 2 + 1] = Math.random() * this.canvas.height;
    }

    if (this.posBuffer) {
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.posBuffer);
      this.gl.bufferData(this.gl.ARRAY_BUFFER, this.positions, this.gl.DYNAMIC_DRAW);
    }
  }

  private animate = () => {
    const gl = this.gl;
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.uniform1f(gl.getUniformLocation(this.program, 'uTime'), performance.now() * 0.001);
    gl.uniform1f(gl.getUniformLocation(this.program, 'uScroll'), window.scrollY * this.parallax);
    gl.uniform2f(
      gl.getUniformLocation(this.program, 'uResolution'),
      this.canvas.width,
      this.canvas.height
    );

    gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, this.starCount);
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
