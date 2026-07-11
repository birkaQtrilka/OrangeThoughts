import { createProgram } from "../gl/gl.utils";
import { BLOOM_BLUR_FRAG } from "../shaders/bloom-blur.frag";
import { BLOOM_PREFILTER_FRAG } from "../shaders/bloom-prefilter.frag";
import { POST_VERT } from "../shaders/post.vert";

export class BloomPass {
  private readonly SCALE = .5;

  textures: WebGLTexture[] = [];
  fbos: WebGLFramebuffer[] = [];
  private bloomPrefilterProgram!: WebGLProgram;
  private bloomBlurProgram!: WebGLProgram;

  private uni = {
    prefilter: {} as Record<string, WebGLUniformLocation | null>,
    blur: {} as Record<string, WebGLUniformLocation | null>,
  };

  constructor(
    private gl: WebGL2RenderingContext,
    private width: number,
    private height: number
  ) {
    this.bloomPrefilterProgram = createProgram(this.gl, POST_VERT, BLOOM_PREFILTER_FRAG);
    this.bloomBlurProgram = createProgram(this.gl, POST_VERT, BLOOM_BLUR_FRAG);

    this.createBloomBuffers();
    this.initializeUniforms();
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

  initializeUniforms() {
    const gl = this.gl;
    this.uni.prefilter['uScene'] = gl.getUniformLocation(this.bloomPrefilterProgram, 'uScene');
    this.uni.prefilter['uThreshold'] = gl.getUniformLocation(this.bloomPrefilterProgram, 'uThreshold');
    this.uni.blur['uTexture'] = gl.getUniformLocation(this.bloomBlurProgram, 'uTexture');
    this.uni.blur['uDirection'] = gl.getUniformLocation(this.bloomBlurProgram, 'uDirection');
    this.uni.blur['spread'] = gl.getUniformLocation(this.bloomBlurProgram, 'spread');
    this.uni.blur['uResolution'] = gl.getUniformLocation(this.bloomBlurProgram, 'uResolution');
  }

  resize(width: number, height: number) {
    if (!this.textures?.length) return;
    this.width = Math.max(1, Math.floor(width * this.SCALE));
    this.height = Math.max(1, Math.floor(height * this.SCALE));

    for (const tex of this.textures) {
      this.gl.bindTexture(this.gl.TEXTURE_2D, tex);
      this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.width, this.height, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, null);
    }
  }

  render(sceneTex: WebGLTexture, time: number) {
    this.bloomPrefilter(sceneTex);
    let spread = 1;
    for (let i = 0; i < 2; i++) {
      this.bloom(1, 1, 0, spread);
      this.bloom(0, 0, 1, spread);
      spread *= 2;
    }
  }

  bloom(direction: number, frameBufferIndex: number, textureIndex: number, spread: number) {
    const gl = this.gl;

    gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbos[frameBufferIndex]);
    gl.viewport(0, 0, this.width, this.height);

    gl.useProgram(this.bloomBlurProgram);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.textures[textureIndex]);
    gl.uniform1i(this.uni.blur['uTexture'], 0);
    gl.uniform2f(this.uni.blur['uDirection'], direction, direction == 0 ? 1 : 0);
    gl.uniform1f(this.uni.blur['spread'], spread);
    gl.uniform2f(this.uni.blur['uResolution'], this.width, this.height);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  bloomPrefilter(sceneTex :WebGLTexture) {
    const gl = this.gl;
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbos[0]);
    gl.viewport(0, 0, this.width, this.height);

    gl.useProgram(this.bloomPrefilterProgram);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, sceneTex);
    gl.uniform1i(this.uni.prefilter['uScene'], 0);
    gl.uniform1f(this.uni.prefilter['uThreshold'], 0.1);

    gl.drawArrays(gl.TRIANGLES, 0, 3);

  }

}
