import { bindBuffer, createProgram, enableAttrib } from "../gl/gl.utils";
import { FRAG } from "../shaders/starfield.frag";
import { VERT } from "../shaders/starfield.vert";

export class StarPass {
  readonly positions: Float32Array;
  readonly posBuffer: WebGLBuffer;
  
  private fbo!: WebGLFramebuffer;
  public colorTex!: WebGLTexture;
  private program: WebGLProgram;
  
  constructor(
    private gl: WebGL2RenderingContext,
    private starCount: number,
    private width: number,
    private height: number,
    public parallax: number
  ) {
    this.program = createProgram(gl, VERT, FRAG);
    this.createFramebuffer();
    gl.useProgram(this.program);
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
    bindBuffer(gl, quad, 0, 2, 0);

    // positions
    this.posBuffer = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.posBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.positions, gl.DYNAMIC_DRAW);
    enableAttrib(gl, 1, 2, 1);

    bindBuffer(gl, sizes, 2, 1, 1);
    bindBuffer(gl, speeds, 3, 1, 1);
    bindBuffer(gl, phases, 4, 1, 1);
  }

  reset(width: number, height: number) {
    this.width = width;
    this.height = height;
    
    this.gl.viewport(0, 0, width, height);

    if (this.colorTex) {
      this.gl.bindTexture(this.gl.TEXTURE_2D, this.colorTex);
      this.gl.texImage2D(
        this.gl.TEXTURE_2D,
        0,
        this.gl.RGBA,
        width,
        height,
        0,
        this.gl.RGBA,
        this.gl.UNSIGNED_BYTE,
        null
      );

    }

    this.resetStarPositions();
    
  }

  render(time: number) {
    const gl = this.gl;

    gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo);
    gl.viewport(0, 0, this.width, this.height);

    // Clear FBO each frame
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Stars need blending
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    gl.useProgram(this.program);
    gl.uniform1f(gl.getUniformLocation(this.program, 'uTime'), time);
    gl.uniform1f(gl.getUniformLocation(this.program, 'uScroll'), window.scrollY * this.parallax);
    gl.uniform2f(gl.getUniformLocation(this.program, 'uResolution'), this.width, this.height);

    gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, this.starCount);

    // Fullscreen passes should NOT blend (avoid accumulation)
    gl.disable(gl.BLEND);
  }

  private createFramebuffer() {
    const gl = this.gl;

    this.colorTex = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, this.colorTex);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      this.width,
      this.height,
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
      this.positions[i * 2] = Math.random() * this.width;
      this.positions[i * 2 + 1] = Math.random() * this.height;
    }

    if (this.posBuffer) {
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.posBuffer);
      this.gl.bufferData(this.gl.ARRAY_BUFFER, this.positions, this.gl.DYNAMIC_DRAW);
    }
  }
}
