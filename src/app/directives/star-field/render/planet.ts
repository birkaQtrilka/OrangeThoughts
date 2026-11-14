import { createProgram } from "../gl/gl.utils";
import { PLANET_FRAG } from "../shaders/planet.frag";
import { POST_VERT } from "../shaders/post.vert";
import { computeLayout, type SceneLayout } from "../scene/layout";

const UNIFORM_NAMES = [
  'uScene', 'uResolution', 'lightPos', 'cameraDir', 'planetPos', 'planetR',
  'outerRadius', 'uNoise3D', 'noiseDensity', 'time', 'voronoi',
  'uMoonPos', 'uMoonR', 'uMoonSpin',
];

export class PlanetPass {

  private fbo!: WebGLFramebuffer;
  private program: WebGLProgram;
  private uni: Record<string, WebGLUniformLocation | null> = {};
  public colorTex!: WebGLTexture;
  private dist = 1.65;
  public noiseTex: WebGLTexture | null = null;
  public vnoiseTex: WebGLTexture | null = null;

  dispose() {
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
      gl.RGBA16F,
      this.width,
      this.height,
      0,
      gl.RGBA,
      gl.HALF_FLOAT,
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
    for (const name of UNIFORM_NAMES) this.initUniform(name);
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
        this.gl.TEXTURE_2D, 0, this.gl.RGBA16F, width, height, 0, this.gl.RGBA, this.gl.HALF_FLOAT, null
      );
    }
  }

  isMobile(): boolean {
    return window.innerWidth <= 768;
  }

  /** Renders the planet + moon and returns the layout so other passes can use the same numbers. */
  render(sceneTex: WebGLTexture, time: number): SceneLayout {
    const gl = this.gl;
    const layout = computeLayout(time, window.scrollY, this.isMobile());

    gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo);
    gl.viewport(0, 0, this.width, this.height);
    gl.disable(gl.BLEND);

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

    gl.uniform1f(this.uni['noiseDensity'], this.dist);
    gl.uniform1f(this.uni['time'], time);
    gl.uniform2f(this.uni['uResolution'], this.width, this.height);
    gl.uniform3f(this.uni['cameraDir'], 0, 0, 1);

    gl.uniform3f(this.uni['planetPos'], ...layout.planetPos);
    gl.uniform1f(this.uni['planetR'], layout.planetRadius);
    gl.uniform1f(this.uni['outerRadius'], layout.planetRadius + 0.08);
    gl.uniform3f(this.uni['lightPos'], ...layout.lightPos);
    gl.uniform3f(this.uni['uMoonPos'], ...layout.moonPos);
    gl.uniform1f(this.uni['uMoonR'], layout.moonRadius);
    gl.uniform1f(this.uni['uMoonSpin'], layout.moonSpin);

    gl.drawArrays(gl.TRIANGLES, 0, 3);
    return layout;
  }
}