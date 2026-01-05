import { createProgram } from "../gl/gl.utils";
import { BLOOM_BLUR_FRAG } from "../shaders/bloom-blur.frag";
import { BLOOM_PREFILTER_FRAG } from "../shaders/bloom-prefilter.frag";
import { POST_VERT } from "../shaders/post.vert";

export class BloomPass {
  textures: WebGLTexture[] = [];
  fbos: WebGLFramebuffer[] = [];
  private bloomPrefilterProgram!: WebGLProgram;
  private bloomBlurProgram!: WebGLProgram;

  constructor(
    private gl: WebGL2RenderingContext,
    private width: number,
    private height: number
  ) {
    this.bloomPrefilterProgram = createProgram(this.gl, POST_VERT, BLOOM_PREFILTER_FRAG);
    this.bloomBlurProgram = createProgram(this.gl, POST_VERT, BLOOM_BLUR_FRAG);

    this.createBloomBuffers();

    this.resize(width, height);
  }

  private createBloomBuffers() {
    const gl = this.gl;

    this.fbos = [];
    this.textures = [];

    for (let i = 0; i < 2; i++) {
      const tex = gl.createTexture()!;
      gl.bindTexture(gl.TEXTURE_2D, tex);
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

      const fbo = gl.createFramebuffer()!;
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(
        gl.FRAMEBUFFER,
        gl.COLOR_ATTACHMENT0,
        gl.TEXTURE_2D,
        tex,
        0
      );

      this.textures.push(tex);
      this.fbos.push(fbo);
    }

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }

  resize(width: number, height: number) {
    if (!this.textures?.length) return;
     this.width = width;
    this.height = height;
    for (const tex of this.textures) {
      this.gl.bindTexture(this.gl.TEXTURE_2D, tex);
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

    
  }

  render(sceneTex: WebGLTexture, time: number) {
    const gl = this.gl;
    // ---------- PASS 2: bloom prefilter ----------
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbos[0]);
    gl.viewport(0, 0, this.width, this.height);

    // Clear bloom target
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(this.bloomPrefilterProgram);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, sceneTex);
    gl.uniform1i(gl.getUniformLocation(this.bloomPrefilterProgram, 'uScene'), 0);
    gl.uniform1f(gl.getUniformLocation(this.bloomPrefilterProgram, 'uThreshold'), 0.2);

    gl.drawArrays(gl.TRIANGLES, 0, 3);

    // ---------- PASS 3: blur horizontal ----------
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbos[1]);
    gl.viewport(0, 0, this.width, this.height);

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(this.bloomBlurProgram);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.textures[0]);
    gl.uniform1i(gl.getUniformLocation(this.bloomBlurProgram, 'uTexture'), 0);
    gl.uniform2f(gl.getUniformLocation(this.bloomBlurProgram, 'uDirection'), 1, 0);
    gl.uniform1f(gl.getUniformLocation(this.bloomBlurProgram, 'spread'), 3);
    gl.uniform2f(gl.getUniformLocation(this.bloomBlurProgram, 'uResolution'), this.width, this.height);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    // ---------- PASS 4: blur vertical ----------
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbos[0]);
    gl.viewport(0, 0, this.width, this.height);

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // same blur program, just different input + direction
    gl.useProgram(this.bloomBlurProgram);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.textures[1]);
    gl.uniform1i(gl.getUniformLocation(this.bloomBlurProgram, 'uTexture'), 0);
    gl.uniform1f(gl.getUniformLocation(this.bloomBlurProgram, 'spread'), 3);
    gl.uniform2f(gl.getUniformLocation(this.bloomBlurProgram, 'uDirection'), 0, 1);
    gl.uniform2f(gl.getUniformLocation(this.bloomBlurProgram, 'uResolution'), this.width, this.height);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
}
