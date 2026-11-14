import { createProgram } from '../gl/gl.utils';
import { HAT_FRAG, HAT_VERT } from '../shaders/hat.glsl';
import type { SceneLayout } from '../scene/layout';

export interface HatTransformConfig {
  heightInMoonRadii: number;
  /** 1 = base centre on the moon surface, <1 = sunk into the moon, >1 = floating. */
  sink: number;
  /** Direction from the moon centre to the hat's base (radians). */
  place: { x: number; z: number };
  /** Fine XYZ offset in moon radii, in the moon's spinning frame. */
  offset: { x: number; y: number; z: number };
  /** Extra rotation around the hat's own base centre (radians). */
  rot: { x: number; y: number; z: number };
}

export const DEFAULT_HAT_TRANSFORM: HatTransformConfig = {
  "heightInMoonRadii": 1.25,
  "sink": 1.07,
  "place": {
    "x": 0.52,
    "z": 0
  },
  "offset": {
    "x": 0.04,
    "y": -0.39,
    "z": -0.22
  },
  "rot": {
    "x": 0.93,
    "y": -1.98,
    "z": -0.02
  }
}

const AMBIENT = 0.1 / Math.PI;
const KEY = 1.9 / Math.PI;

const UNIFORMS = ['uModel', 'uAspect', 'uTex', 'uLightDir', 'uPlanet', 'uMoon', 'uAmbient', 'uKey'];

export class ChristmasHatPass {
  public transform: HatTransformConfig = structuredClone(DEFAULT_HAT_TRANSFORM);

  private readonly program: WebGLProgram;
  private readonly vao: WebGLVertexArrayObject;
  private readonly vbo: WebGLBuffer;
  private readonly ibo: WebGLBuffer;
  private readonly tex: WebGLTexture;
  private readonly uni: Record<string, WebGLUniformLocation | null> = {};
  private readonly model = new Float32Array(16);
  private indexCount = 0;
  private ready = false;
  private disposed = false;

  constructor(
    private readonly gl: WebGL2RenderingContext,
    private width: number,
    private height: number
  ) {
    this.program = createProgram(gl, HAT_VERT, HAT_FRAG);
    for (const name of UNIFORMS) this.uni[name] = gl.getUniformLocation(this.program, name);
    this.vao = gl.createVertexArray()!;
    this.vbo = gl.createBuffer()!;
    this.ibo = gl.createBuffer()!;
    this.tex = gl.createTexture()!;
  }

  async initialize(
    meshUrl = '/assets/Models/ChristmasHat/hat.bin',
    textureUrl = '/assets/Models/ChristmasHat/Colores.png'
  ): Promise<void> {
    const loadImage = async (url: string) => {
      const img = new Image();
      img.src = url;
      await img.decode();
      return img;
    };

    const [meshBuf, image] = await Promise.all([
      fetch(meshUrl).then((r) => {
        if (!r.ok) throw new Error(`Failed to load ${meshUrl}`);
        return r.arrayBuffer();
      }),
      loadImage(textureUrl),
    ]);
    if (this.disposed) return;

    const gl = this.gl;
    const [vertexCount, indexCount] = new Uint32Array(meshBuf, 0, 2);
    const vertices = new Float32Array(meshBuf, 16, vertexCount * 8);
    const indices = new Uint32Array(meshBuf, 16 + vertexCount * 32, indexCount);

    gl.bindVertexArray(this.vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 32, 0);
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 32, 12);
    gl.enableVertexAttribArray(2);
    gl.vertexAttribPointer(2, 2, gl.FLOAT, false, 32, 24);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
    gl.bindVertexArray(null);
    this.indexCount = indexCount;

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.tex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.NONE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.SRGB8_ALPHA8, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    this.ready = true;
  }

  resize(width: number, height: number): void {
    this.width = width;
    this.height = height;
  }

  /** Draw into `target` (null = canvas). Call after your last pass. */
  render(layout: SceneLayout, target: WebGLFramebuffer | null = null): void {
    if (!this.ready) return;
    const [mx, my, mz] = layout.moonPos;
    if (mz < 0.05) return;
    const r = layout.moonRadius;
    const gl = this.gl;

    // Scene space = shader space with z negated.
    composeModel(this.model, [mx, my, -mz], r, layout.moonSpin, this.transform);

    // Direction to the light, in the same space the moon is shaded in (z negated).
    let lx = layout.lightPos[0] - mx;
    let ly = layout.lightPos[1] - my;
    let lz = -(layout.lightPos[2] - mz);
    const len = Math.hypot(lx, ly, lz) || 1;
    lx /= len; ly /= len; lz /= len;

    gl.bindFramebuffer(gl.FRAMEBUFFER, target);
    gl.viewport(0, 0, this.width, this.height);
    gl.disable(gl.BLEND);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.depthMask(true);
    gl.clearDepth(1);
    gl.clear(gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
    gl.frontFace(gl.CCW);

    gl.useProgram(this.program);
    gl.uniformMatrix4fv(this.uni['uModel'], false, this.model);
    gl.uniform1f(this.uni['uAspect'], this.width / this.height);
    gl.uniform3f(this.uni['uLightDir'], lx, ly, lz);
    gl.uniform4f(this.uni['uPlanet'], ...layout.planetPos, layout.planetRadius);
    gl.uniform4f(this.uni['uMoon'], mx, my, mz, r);
    gl.uniform1f(this.uni['uAmbient'], AMBIENT);
    gl.uniform1f(this.uni['uKey'], KEY);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.tex);
    gl.uniform1i(this.uni['uTex'], 0);

    gl.bindVertexArray(this.vao);
    gl.drawElements(gl.TRIANGLES, this.indexCount, gl.UNSIGNED_INT, 0);
    gl.bindVertexArray(null);

    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.CULL_FACE);
  }

  dispose(): void {
    this.disposed = true;
    this.ready = false;
    const gl = this.gl;
    gl.deleteProgram(this.program);
    gl.deleteVertexArray(this.vao);
    gl.deleteBuffer(this.vbo);
    gl.deleteBuffer(this.ibo);
    gl.deleteTexture(this.tex);
  }
}

// ---- math -----------------------------------------------------------------

/** Column-major 3x3: element (row, col) lives at [col * 3 + row]. */
type Mat3 = readonly [number, number, number, number, number, number, number, number, number];

const rotX = (a: number): Mat3 => {
  const c = Math.cos(a), s = Math.sin(a);
  return [1, 0, 0, 0, c, s, 0, -s, c];
};
const rotY = (a: number): Mat3 => {
  const c = Math.cos(a), s = Math.sin(a);
  return [c, 0, -s, 0, 1, 0, s, 0, c];
};
const rotZ = (a: number): Mat3 => {
  const c = Math.cos(a), s = Math.sin(a);
  return [c, s, 0, -s, c, 0, 0, 0, 1];
};

/** a * b */
function mul(a: Mat3, b: Mat3): Mat3 {
  const o = new Array<number>(9);
  for (let col = 0; col < 3; col++) {
    for (let row = 0; row < 3; row++) {
      o[col * 3 + row] =
        a[row] * b[col * 3] + a[3 + row] * b[col * 3 + 1] + a[6 + row] * b[col * 3 + 2];
    }
  }
  return o as unknown as Mat3;
}

/**
 * M = T(moon) * Ry(spin) * T(baseOffset) * Rplace * Rrot * S
 *
 * - Ry(spin) spins the whole moon-mounted frame around the moon's Y axis, matching planet.frag.
 * - Rplace picks the spot on the moon; the base centre is placed along Rplace's up axis.
 * - Rrot rotates the hat around that base centre.
 */
function composeModel(
  out: Float32Array,
  moon: readonly [number, number, number],
  moonR: number,
  spin: number,
  cfg: HatTransformConfig
): void {
  const rSpin = rotY(spin);
  const rPlace = mul(rotZ(-cfg.place.z), rotX(cfg.place.x));
  const rLocal = mul(mul(rotZ(cfg.rot.z), rotY(cfg.rot.y)), rotX(cfg.rot.x));

  const rPlaced = mul(rSpin, rPlace);
  const rot = mul(rPlaced, rLocal);

  const d = moonR * cfg.sink;
  const ox = cfg.offset.x * moonR;
  const oy = cfg.offset.y * moonR;
  const oz = cfg.offset.z * moonR;

  const tx = moon[0] + rPlaced[3] * d + rSpin[0] * ox + rSpin[3] * oy + rSpin[6] * oz;
  const ty = moon[1] + rPlaced[4] * d + rSpin[1] * ox + rSpin[4] * oy + rSpin[7] * oz;
  const tz = moon[2] + rPlaced[5] * d + rSpin[2] * ox + rSpin[5] * oy + rSpin[8] * oz;

  const s = moonR * cfg.heightInMoonRadii;
  out[0] = rot[0] * s;  out[1] = rot[1] * s;  out[2] = rot[2] * s;  out[3] = 0;
  out[4] = rot[3] * s;  out[5] = rot[4] * s;  out[6] = rot[5] * s;  out[7] = 0;
  out[8] = rot[6] * s;  out[9] = rot[7] * s;  out[10] = rot[8] * s; out[11] = 0;
  out[12] = tx;         out[13] = ty;         out[14] = tz;         out[15] = 1;
}