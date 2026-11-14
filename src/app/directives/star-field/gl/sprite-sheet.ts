/**
 * Loads an image into a WebGL2 texture and describes its grid layout.
 * Row 0 is the TOP row of the image, column 0 is the LEFT column.
 * Frame index = row * columns + column.
 */
export class SpriteSheet {
  readonly texture: WebGLTexture;
  private disposed = false;

  constructor(
    private readonly gl: WebGL2RenderingContext,
    url: string,
    readonly columns: number,
    readonly rows: number
  ) {
    this.texture = gl.createTexture()!;

    // 1x1 transparent placeholder so rendering works before the image arrives
    const prev = gl.getParameter(gl.TEXTURE_BINDING_2D);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.texImage2D(
      gl.TEXTURE_2D, 0, gl.RGBA8, 1, 1, 0,
      gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 0])
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.bindTexture(gl.TEXTURE_2D, prev);

    this.load(url);
  }

  get frameCount(): number {
    return this.columns * this.rows;
  }

  /** Binds the sheet to the given texture unit (0, 1, ...). */
  bind(unit = 0) {
    this.gl.activeTexture(this.gl.TEXTURE0 + unit);
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
  }

  dispose() {
    this.disposed = true;
    this.gl.deleteTexture(this.texture);
  }

  private load(url: string) {
    const img = new Image();
    img.onload = () => this.upload(img);
    img.onerror = () => console.error(`SpriteSheet: failed to load "${url}"`);
    img.src = url;
  }

  private upload(img: HTMLImageElement) {
    if (this.disposed) return;
    const gl = this.gl;

    // Restore whatever was bound so this async callback can't disturb other passes
    const prev = gl.getParameter(gl.TEXTURE_BINDING_2D);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);

    // Premultiplied alpha avoids dark fringes when filtering / mipmapping.
    // The shader output and blend func must be premultiplied too.
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, gl.RGBA, gl.UNSIGNED_BYTE, img);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);

    // Stars are drawn much smaller than a sprite cell, so mipmaps matter
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);

    gl.bindTexture(gl.TEXTURE_2D, prev);
  }
}