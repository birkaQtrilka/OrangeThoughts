import { bindBuffer, bindBufferDynamic, createProgram } from "../gl/gl.utils";
import { SpriteSheet } from "../gl/sprite-sheet";
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
  // ---- Sprite sheet configuration ----
  private readonly spriteUrl = 'assets/Textures/White Sparkle Icon Sheet.png';
  private readonly spriteColumns = 6;
  private readonly spriteRows = 4;
  /** Frame indices (row * columns + column) a star may randomly pick from. First 6 = first row. */
  private readonly starFrames: number[] = [0, 1, 2, 3, 4, 5,6,7,8,12,13,14,16,23];

  // ---- Star size configuration (pixels) ----
  private readonly starSizeMin = 10;
  private readonly starSizeMax = 25;

  readonly positions: Float32Array;
  readonly buffers: WebGLBuffer[] = [];

  private fbo!: WebGLFramebuffer;
  public colorTex!: WebGLTexture;
  private program: WebGLProgram;
  private bgProgram: WebGLProgram;
  private vao: WebGLVertexArrayObject;
  private sprites: SpriteSheet;

  private bgUniforms: {
    scrollY: WebGLUniformLocation | null;
    windowHeight: WebGLUniformLocation | null;
    documentHeight: WebGLUniformLocation | null;
  };
  private starUniforms: {
    time: WebGLUniformLocation | null;
    scroll: WebGLUniformLocation | null;
    resolution: WebGLUniformLocation | null;
    sprite: WebGLUniformLocation | null;
    spriteGrid: WebGLUniformLocation | null;
  };

  constructor(
    private gl: WebGL2RenderingContext,
    private starCount: number,
    private width: number,
    private height: number,
    public parallax: number,
    private readonly starsEnabled = true
  ) {
    this.program = createProgram(gl, VERT, FRAG);
    this.bgProgram = createProgram(gl, BG_VERT, BG_FRAG);

    this.bgUniforms = {
      scrollY: gl.getUniformLocation(this.bgProgram, 'uScrollY'),
      windowHeight: gl.getUniformLocation(this.bgProgram, 'uWindowHeight'),
      documentHeight: gl.getUniformLocation(this.bgProgram, 'uDocumentHeight'),
    };
    this.starUniforms = {
      time: gl.getUniformLocation(this.program, 'uTime'),
      scroll: gl.getUniformLocation(this.program, 'uScroll'),
      resolution: gl.getUniformLocation(this.program, 'uResolution'),
      sprite: gl.getUniformLocation(this.program, 'uSprite'),
      spriteGrid: gl.getUniformLocation(this.program, 'uSpriteGrid'),
    };

    this.sprites = new SpriteSheet(
      gl,
      encodeURI(this.spriteUrl), // the file name contains spaces
      this.spriteColumns,
      this.spriteRows,
      this.starsEnabled
    );

    const validFrames = this.starFrames.filter(
      f => Number.isInteger(f) && f >= 0 && f < this.sprites.frameCount
    );
    if (validFrames.length === 0) {
      throw new Error('StarPass: starFrames contains no valid frame indices');
    }

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
    const spriteIndices = new Float32Array(this.starCount);

    const sizeRange = this.starSizeMax - this.starSizeMin;
    for (let i = 0; i < this.starCount; i++) {
      sizes[i] = Math.random() * sizeRange + this.starSizeMin;
      speeds[i] = Math.random() * 0.4 + 0.2;
      phases[i] = Math.random() * Math.PI * 2;
      spriteIndices[i] = validFrames[Math.floor(Math.random() * validFrames.length)];
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
    this.buffers.push(bindBuffer(gl, spriteIndices, 5, 1, 1));

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

    // --- Background ---
    gl.disable(gl.BLEND);
    gl.useProgram(this.bgProgram);

    const scrollY = window.scrollY;
    const winH = window.innerHeight;
    const docH = Math.max(document.documentElement.scrollHeight, winH);

    gl.uniform1f(this.bgUniforms.scrollY, scrollY);
    gl.uniform1f(this.bgUniforms.windowHeight, winH);
    gl.uniform1f(this.bgUniforms.documentHeight, docH);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    if (!this.starsEnabled) return;

    // --- Stars (sprites are uploaded premultiplied, so use ONE / ONE_MINUS_SRC_ALPHA) ---
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    gl.useProgram(this.program);
    gl.uniform1f(this.starUniforms.time, time);
    gl.uniform1f(this.starUniforms.scroll, scrollY * this.parallax);
    gl.uniform2f(this.starUniforms.resolution, this.width, this.height);
    gl.uniform2f(this.starUniforms.spriteGrid, this.sprites.columns, this.sprites.rows);

    this.sprites.bind(0);
    gl.uniform1i(this.starUniforms.sprite, 0);

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
    this.sprites.dispose();
    this.gl.deleteVertexArray(this.vao);
    this.buffers.forEach(b => {
      this.gl.deleteBuffer(b);
    });
  }
}