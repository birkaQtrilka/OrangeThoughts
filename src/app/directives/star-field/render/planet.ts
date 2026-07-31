import { bindBuffer, createProgram, enableAttrib } from "../gl/gl.utils";
import { PLANET_FRAG } from "../shaders/planet.frag";
import { POST_VERT } from "../shaders/post.vert";

export class PlanetPass {
  
  private fbo!: WebGLFramebuffer;
  private program: WebGLProgram;
  private uni:  Record<string, WebGLUniformLocation | null> = {} as Record<string, WebGLUniformLocation | null>;
  public colorTex!: WebGLTexture;
  private dist: number = .1;

  constructor(
    private gl: WebGL2RenderingContext,
    private width: number,
    private height: number,
  ) {
    this.program = createProgram(gl, POST_VERT, PLANET_FRAG);
    gl.useProgram(this.program);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    // document.addEventListener('keydown', (ev)=>{
    //   if(ev.key == 'ArrowLeft'){
    //     this.dist += 0.01;
    //     console.log(this.dist);
    //   }else if (ev.key == 'ArrowRight') {
    //     this.dist -= 0.01;
    //     console.log(this.dist);

    //   }
    // });
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
    this.initUniform('uScene');
    this.initUniform('scrollY');
    this.initUniform('uResolution');
    this.initUniform('lightPos');
    this.initUniform('cameraDir');
    this.initUniform('planetPos');
    this.initUniform('planetR');
    this.initUniform('scrollSpeed');
    this.initUniform('fadeDistance');
    this.initUniform('fadeThreshold');
  }
  initUniform(name: string) {
    this.uni[name] = this.gl.getUniformLocation(this.program, name);
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

  isMobile(): boolean {
    return window.innerWidth <= 768;
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
    gl.uniform1f(this.uni['scrollSpeed'], 0.0001);
    gl.uniform1f(this.uni['planetR'], 0.7);
    gl.uniform1f(this.uni['fadeThreshold'], 0.02);
    gl.uniform1f(this.uni['fadeDistance'], 5);
    gl.uniform2f(this.uni['uResolution'], this.width, this.height);
    gl.uniform3f(this.uni['lightPos'], .5, 1, 1);
    gl.uniform3f(this.uni['cameraDir'], 0.0,0.0,1.0);
    if(this.isMobile()){
      gl.uniform3f(this.uni['planetPos'],0.0, -0.9, 1.1);
    }else{
      gl.uniform3f(this.uni['planetPos'],0.0, -0.7, 1.1);
    }
    
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

}
