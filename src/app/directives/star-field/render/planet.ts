import { createProgram} from "../gl/gl.utils";
import { PLANET_FRAG } from "../shaders/planet.frag";
import { POST_VERT } from "../shaders/post.vert";

export class PlanetPass {
  
  private fbo!: WebGLFramebuffer;
  private program: WebGLProgram;
  private uni:  Record<string, WebGLUniformLocation | null> = {} as Record<string, WebGLUniformLocation | null>;
  public colorTex!: WebGLTexture;
  private dist: number = 1.65;
  public noiseTex: WebGLTexture | null = null;
  public vnoiseTex: WebGLTexture | null = null;

  dispose(){
    document.removeEventListener('keydown', this.onKeyDownPress);
  }

  constructor(
    private gl: WebGL2RenderingContext,
    private width: number,
    private height: number,
  ) {
    this.program = createProgram(gl, POST_VERT, PLANET_FRAG);
    gl.useProgram(this.program);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    document.addEventListener('keydown', this.onKeyDownPress);
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

    this.loadNoiseTexture();
  }
  
  async loadNoiseTexture() {
    try {
      // Make sure this path points to where noise3d.bin is served on your dev server!
      const response = await fetch('/assets/Textures/noise3d.bin');
      const buffer = await response.arrayBuffer();
      const data = new Uint8Array(buffer);

      const gl = this.gl;
      this.noiseTex = gl.createTexture()!;
      gl.bindTexture(gl.TEXTURE_3D, this.noiseTex);
      
      gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      
      gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_WRAP_S, gl.REPEAT);
      gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_WRAP_T, gl.REPEAT);
      gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_WRAP_R, gl.REPEAT);
      
      gl.texImage3D(gl.TEXTURE_3D, 0, gl.R8, 64, 64, 64, 0, gl.RED, gl.UNSIGNED_BYTE, data);
      
      console.log("3D Perlin Noise Texture loaded successfully!");

      const response2 = await fetch('/assets/Textures/3dvoronoinoise_rgba.bin');
      const buffer2 = await response2.arrayBuffer();
      const data2 = new Uint8Array(buffer2);

      this.vnoiseTex = gl.createTexture()!;
      gl.bindTexture(gl.TEXTURE_3D, this.vnoiseTex);
      
      gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

      gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_WRAP_S, gl.REPEAT);
      gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_WRAP_T, gl.REPEAT);
      gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_WRAP_R, gl.REPEAT);

      gl.texImage3D(gl.TEXTURE_3D, 0, gl.RGBA8, 64, 64, 64, 0, gl.RGBA, gl.UNSIGNED_BYTE, data2);
      console.log("3D Voronoi Noise Texture loaded successfully!");

    } catch (err) {
      console.error("Failed to load 3D noise texture:", err);
    }
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
    this.initUniform('outerRadius');
    this.initUniform('uNoise3D'); 
    this.initUniform('noiseDensity');
    this.initUniform('time'); 
    this.initUniform('voronoi'); 
  }

  private onKeyDownPress = (ev: KeyboardEvent) => {
  if (ev.key === 'ArrowLeft') this.dist += 0.01;
  else if (ev.key === 'ArrowRight') this.dist -= 0.01;
};

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
    const planetRadius = .7;

    gl.useProgram(this.program);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, sceneTex);
    gl.uniform1i(this.uni['uScene'], 0);

    if (this.noiseTex) {
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_3D, this.noiseTex);
      gl.uniform1i(this.uni['uNoise3D'], 1);
    }
    if (this.vnoiseTex) {
      gl.activeTexture(gl.TEXTURE2);
      gl.bindTexture(gl.TEXTURE_3D, this.vnoiseTex);
      gl.uniform1i(this.uni['voronoi'], 2);
    }

    gl.uniform1f(this.uni['scrollY'], window.scrollY);
    gl.uniform1f(this.uni['scrollSpeed'], 0.0001);
    gl.uniform1f(this.uni['noiseDensity'], this.dist);
    gl.uniform1f(this.uni['time'], time);
    gl.uniform1f(this.uni['planetR'], planetRadius);
    gl.uniform1f(this.uni['outerRadius'], planetRadius + .08);
    gl.uniform2f(this.uni['uResolution'], this.width, this.height);
    gl.uniform3f(this.uni['lightPos'], 0, 1, 1);
    gl.uniform3f(this.uni['cameraDir'], 0.0,0.0,1.0);
    if(this.isMobile()){
      gl.uniform3f(this.uni['planetPos'],0.0, -0.9, 1.1);
    }else{
      gl.uniform3f(this.uni['planetPos'],0.0, -0.7, 1.1);
    }
    
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

}
