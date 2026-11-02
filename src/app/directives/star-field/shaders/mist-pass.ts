import { createProgram } from "../gl/gl.utils";
import { MIST_FRAG } from "./mist-pass.frag";

const VERT = `#version 300 es
layout(location = 0) in vec2 aPos;
out vec2 vUv;
void main() {
    vUv = aPos * 0.5 + 0.5;
    gl_Position = vec4(aPos, 0.0, 1.0);
}`;

export class MistPass {
  private fbo!: WebGLFramebuffer;
  public colorTex!: WebGLTexture;
  private program: WebGLProgram;
  private posBuffer: WebGLBuffer;

  // // Easy tweaks
  // public mistColor = [199, 78, 27]; // Deep space blue/purple
  // public mistAlpha = 0.05;
  
  public mistColor = [66, 64, 114]; // Deep space blue/purple
  public mistAlpha = 0.06
  public mistOnTop = true; // Toggle this to test Above/Below stars!

  constructor(
    private gl: WebGL2RenderingContext,
    private width: number,
    private height: number,
    public parallax: number
  ) {
    this.mistColor = this.mistColor.map(x => x/255);
    this.program = createProgram(gl, VERT, MIST_FRAG);
    this.createFramebuffer();
    this.parallax *= 0.05;
    const quad = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    this.posBuffer = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.posBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, quad, gl.STATIC_DRAW);
  }

  resize(width: number, height: number) {
    this.width = width;
    this.height = height;

    if (this.colorTex) {
      this.gl.bindTexture(this.gl.TEXTURE_2D, this.colorTex);
      this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA16F, width, height, 0, this.gl.RGBA, this.gl.HALF_FLOAT, null);
    }
  }

  render(sceneTex: WebGLTexture, time: number) {
    const gl = this.gl;

    gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo);
    gl.viewport(0, 0, this.width, this.height);
    
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Disable blending (we manually mix it via the shader for accuracy)
    gl.disable(gl.BLEND);

    gl.useProgram(this.program);
    
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, sceneTex);
    gl.uniform1i(gl.getUniformLocation(this.program, 'uSceneTex'), 0);

    gl.uniform1f(gl.getUniformLocation(this.program, 'uTime'), time);
    gl.uniform1f(gl.getUniformLocation(this.program, 'uScroll'), window.scrollY * this.parallax);
    gl.uniform2f(gl.getUniformLocation(this.program, 'uResolution'), this.width, this.height);
    gl.uniform3fv(gl.getUniformLocation(this.program, 'uColor'), this.mistColor);
    gl.uniform1f(gl.getUniformLocation(this.program, 'uAlpha'), this.mistAlpha);
    gl.uniform1i(gl.getUniformLocation(this.program, 'uMistOnTop'), this.mistOnTop ? 1 : 0);

    // Setup Quad Buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, this.posBuffer);
    const posLoc = gl.getAttribLocation(this.program, 'aPos');
    gl.enableVertexAttribArray(posLoc);
    
    gl.vertexAttribDivisor(posLoc, 0);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  private createFramebuffer() {
    const gl = this.gl;
    this.colorTex = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, this.colorTex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, this.width, this.height, 0, gl.RGBA, gl.HALF_FLOAT, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    this.fbo = gl.createFramebuffer()!;
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.colorTex, 0);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }
}