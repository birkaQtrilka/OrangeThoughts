export function createProgram(
  gl: WebGL2RenderingContext,
  vs: string,
  fs: string
): WebGLProgram {
  const v = gl.createShader(gl.VERTEX_SHADER)!;
    gl.shaderSource(v, vs);
    gl.compileShader(v);
    if (!gl.getShaderParameter(v, gl.COMPILE_STATUS)) {
      console.error('Vertex shader error:', gl.getShaderInfoLog(v));
      throw new Error('Vertex shader failed');
    }

    const f = gl.createShader(gl.FRAGMENT_SHADER)!;
    gl.shaderSource(f, fs);
    gl.compileShader(f);
    if (!gl.getShaderParameter(f, gl.COMPILE_STATUS)) {
      console.error('Fragment shader error:', gl.getShaderInfoLog(f));
      throw new Error('Fragment shader failed');
    }

    const p = gl.createProgram()!;
    gl.attachShader(p, v);
    gl.attachShader(p, f);
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(p));
      throw new Error('Program link failed');
    }

    return p;
}

export function createTexture(
  gl: WebGL2RenderingContext,
  width: number,
  height: number
): WebGLTexture {
  const tex = gl.createTexture()!;
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    width,
    height,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    null
  );
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  return tex;
}

export function bindBuffer(gl: WebGL2RenderingContext, data: Float32Array, loc: number, size: number, divisor: number) {
    const buf = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    enableAttrib(gl, loc, size, divisor);
  }

  export function enableAttrib(gl: WebGL2RenderingContext, loc: number, size: number, divisor: number) {
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
    gl.vertexAttribDivisor(loc, divisor);
  }
