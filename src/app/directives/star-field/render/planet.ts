import { bindBuffer, createProgram, enableAttrib } from "../gl/gl.utils";
import { PLANET_FRAG } from "../shaders/planet.frag";
import { POST_VERT } from "../shaders/post.vert";

export class PlanetPass {
  
  private fbo!: WebGLFramebuffer;
  private program: WebGLProgram;
  private uni:  Record<string, WebGLUniformLocation | null> = {} as Record<string, WebGLUniformLocation | null>;
  public colorTex!: WebGLTexture;

  constructor(
    private gl: WebGL2RenderingContext,
    private width: number,
    private height: number,
  ) {
    this.program = createProgram(gl, POST_VERT, PLANET_FRAG);
    gl.useProgram(this.program);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    this.initializeUniforms();

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

    this.fbo = gl.createFramebuffer()!;
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo);
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      this.colorTex,
      0
    );

    // const quad = new Float32Array([
    //   -0.5, -0.5,
    //   0.5, -0.5,
    //   -0.5, 0.5,
    //   0.5, 0.5,
    // ]);

    // quad
    // bindBuffer(gl, quad, 0, 2, 0);

  }
  
  initializeUniforms() {
    const gl = this.gl;
    this.uni['uScene'] = gl.getUniformLocation(this.program, 'uScene');
    this.uni['scrollY'] = gl.getUniformLocation(this.program, 'scrollY');
  }

  reset(width: number, height: number) {
    this.width = width;
    this.height = height;
    
    if (this.colorTex) {
      this.gl.bindTexture(this.gl.TEXTURE_2D, this.colorTex);
      this.gl.texImage2D(
        this.gl.TEXTURE_2D, 0, this.gl.RGBA, width, height, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, null
      );
    }
  }

  render(sceneTex: WebGLTexture, time: number) {
    const gl = this.gl;
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo);
    gl.viewport(0, 0, this.width, this.height);

    gl.useProgram(this.program);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, sceneTex);
    gl.uniform1i(this.uni['uScene'], 0);
    gl.uniform1f(this.uni['scrollY'], window.scrollY);

    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

}
