import { B } from "@angular/cdk/keycodes";
import { bindBuffer, bindBufferDynamic, createProgram, enableAttrib } from "../gl/gl.utils";
import { FRAG } from "../shaders/starfield.frag";
import { VERT } from "../shaders/starfield.vert";

const BG_VERT = `#version 300 es
const vec2 pos[4] = vec2[4](
  vec2(-1.0, -1.0), vec2( 1.0, -1.0), vec2(-1.0,  1.0), vec2( 1.0,  1.0)
);
out vec2 vUv;
void main() {
  vec2 p = pos[gl_VertexID];
  vUv = p * 0.5 + 0.5;
  gl_Position = vec4(p, 0.0, 1.0);
}`;

const BG_FRAG = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 FragColor;

uniform float uScrollY;
uniform float uWindowHeight;
uniform float uDocumentHeight;

void main() {
  // #121014 (Top of document)
  vec3 colorTop = vec3(0.0706, 0.0627, 0.0784);
  // #050405 (Bottom of document)
  vec3 colorBottom = vec3(0.0196, 0.0157, 0.0196);
  
  // vUv.y is 1.0 at the top of the SCREEN, 0.0 at the bottom.
  // We calculate the exact pixel position of this fragment relative to the whole document:
  float pixelY = uScrollY + (1.0 - vUv.y) * uWindowHeight;
  
  // Normalize it (0.0 = top of document, 1.0 = bottom of document)
  float factor = clamp(pixelY / uDocumentHeight, 0.0, 1.0);
  
  vec3 bg = mix(colorTop, colorBottom, factor);
  FragColor = vec4(bg, 1.0);
}`;

export class StarPass {
  readonly positions: Float32Array;
  readonly buffers: WebGLBuffer[] = [];
  
  private fbo!: WebGLFramebuffer;
  public colorTex!: WebGLTexture;
  private program: WebGLProgram;
  private bgProgram: WebGLProgram; 
  private vao: WebGLVertexArrayObject;

  constructor(
    private gl: WebGL2RenderingContext,
    private starCount: number,
    private width: number,
    private height: number,
    public parallax: number
  ) {
    this.program = createProgram(gl, VERT, FRAG);
    this.bgProgram = createProgram(gl, BG_VERT, BG_FRAG); 
    this.createFramebuffer();

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

    this.vao = gl.createVertexArray()!;
    gl.bindVertexArray(this.vao);
    gl.useProgram(this.program);
    this.buffers.push(bindBuffer(gl, quad, 0, 2, 0));

    this.buffers.push(bindBufferDynamic(gl, this.positions, 1, 2, 1));
    this.buffers.push(bindBuffer(gl, sizes, 2, 1, 1));
    this.buffers.push(bindBuffer(gl, speeds, 3, 1, 1));
    this.buffers.push(bindBuffer(gl, phases, 4, 1, 1));

    gl.bindVertexArray(null);
  }

  reset(width: number, height: number) {
    this.width = width;
    this.height = height;
    
    this.gl.viewport(0, 0, width, height);

    if (this.colorTex) {
      this.gl.bindTexture(this.gl.TEXTURE_2D, this.colorTex);
      this.gl.texImage2D(
        this.gl.TEXTURE_2D, 0, this.gl.RGBA16F, width, height, 0, this.gl.RGBA, this.gl.HALF_FLOAT, null
      );
    }
    this.resetStarPositions();
  }

  render(time: number) {
    const gl = this.gl;

    gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo);
    gl.viewport(0, 0, this.width, this.height);

    gl.disable(gl.BLEND);
    gl.useProgram(this.bgProgram);
    
    const scrollY = window.scrollY;
    const winH = window.innerHeight;
    const docH = Math.max(document.documentElement.scrollHeight, winH);

    gl.uniform1f(gl.getUniformLocation(this.bgProgram, 'uScrollY'), scrollY);
    gl.uniform1f(gl.getUniformLocation(this.bgProgram, 'uWindowHeight'), winH);
    gl.uniform1f(gl.getUniformLocation(this.bgProgram, 'uDocumentHeight'), docH);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    
    gl.useProgram(this.program);
    gl.uniform1f(gl.getUniformLocation(this.program, 'uTime'), time);
    gl.uniform1f(gl.getUniformLocation(this.program, 'uScroll'), scrollY * this.parallax);
    gl.uniform2f(gl.getUniformLocation(this.program, 'uResolution'), this.width, this.height);

    gl.bindVertexArray(this.vao);
    gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, this.starCount);
    gl.bindVertexArray(null);

    gl.disable(gl.BLEND);
  }

  private createFramebuffer() {
    const gl = this.gl;
    this.colorTex = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, this.colorTex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, this.width, this.height, 0, gl.RGBA, gl.HALF_FLOAT, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    this.fbo = gl.createFramebuffer()!;
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.colorTex, 0);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }

  private resetStarPositions() {
    if (!this.positions) return;
    for (let i = 0; i < this.starCount; i++) {
      this.positions[i * 2] = Math.random() * this.width;
      this.positions[i * 2 + 1] = Math.random() * this.height;
    }
    // positions buffer 
    if (this.buffers[1]) {
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers[1]);
      this.gl.bufferData(this.gl.ARRAY_BUFFER, this.positions, this.gl.DYNAMIC_DRAW);
    }
  }

  dispose() {
    this.gl.deleteVertexArray(this.vao);
    this.buffers.forEach(b => {
      this.gl.deleteBuffer(b);
    });
  }
}