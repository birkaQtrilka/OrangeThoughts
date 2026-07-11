import { Directive, Input, NgZone, OnDestroy, OnInit } from '@angular/core';
import { POST_VERT } from './shaders/post.vert';
import { POST_FRAG } from './shaders/post.frag';
import { createProgram } from './gl/gl.utils';
import { StarPass } from './render/star-pass';
import { BloomPass } from './render/bloom-pass';

@Directive({
  selector: '[appStarfield]',
  standalone: true,
})
export class StarfieldDirective implements OnInit, OnDestroy {
  @Input() starCount = 300;
  @Input() parallax = 0.007;

  private canvas!: HTMLCanvasElement;
  private gl!: WebGL2RenderingContext;
  private postProgram!: WebGLProgram;

  private starFieldProgram!: StarPass;
  private bloomProgram!: BloomPass;

  private animationId = 0;

  constructor(private zone: NgZone) { }

  ngOnInit(): void {
    this.createCanvas();
    window.addEventListener('resize', this.resize);
    this.initGL();
    this.resize();
    this.zone.runOutsideAngular(() => this.animate());
  }


  ngOnDestroy(): void {
    cancelAnimationFrame(this.animationId);
    window.removeEventListener('resize', this.resize);
    this.canvas.remove();
  }

  private createCanvas() {
    this.canvas = document.createElement('canvas');
    Object.assign(this.canvas.style, {
      position: 'fixed',
      inset: '0',
      pointerEvents: 'none',
    });

    document.body.querySelector('.wrapper')?.prepend(this.canvas);

    const gl = this.canvas.getContext('webgl2', { alpha: true });
    if (!gl) throw new Error('WebGL2 not supported');
    this.gl = gl;

  }

private resize = () => {
    this.canvas.style.width = innerWidth + 'px';
    this.canvas.style.height = innerHeight + 'px';

    const MAX_WIDTH = 1920;
    const MAX_HEIGHT = 1080;
    
    const scaleX = Math.min(1, MAX_WIDTH / innerWidth);
    const scaleY = Math.min(1, MAX_HEIGHT / innerHeight);
    const scale = Math.min(scaleX, scaleY); // Maintain aspect ratio scaling

    this.canvas.width = Math.floor(innerWidth * scale);
    this.canvas.height = Math.floor(innerHeight * scale);

    this.starFieldProgram.reset(this.canvas.width, this.canvas.height);
    this.bloomProgram.resize(this.canvas.width, this.canvas.height);
  };

  private initGL() {
    const gl = this.gl;

    this.postProgram = createProgram(this.gl, POST_VERT, POST_FRAG);
    
    this.starFieldProgram = new StarPass(
      gl,
      this.starCount,
      this.canvas.width,
      this.canvas.height,
      this.parallax
    );

    this.bloomProgram = new BloomPass(
      gl,
      this.canvas.width,
      this.canvas.height
    );
  }
   
  private animate = () => {
    const gl = this.gl;
    const time = performance.now() * 0.001;

    this.starFieldProgram.render(time);
    const sceneTex = this.starFieldProgram.colorTex;
    this.bloomProgram.render(sceneTex, time);
    
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, this.canvas.width, this.canvas.height);

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(this.postProgram);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, sceneTex);
    gl.uniform1i(gl.getUniformLocation(this.postProgram, 'uScene'), 0);

    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this.bloomProgram.textures[0]);
    gl.uniform1i(gl.getUniformLocation(this.postProgram, 'uBloom'), 1);

    gl.uniform1f(gl.getUniformLocation(this.postProgram, 'uBloomStrength'), 1);

    gl.drawArrays(gl.TRIANGLES, 0, 3);

    this.animationId = requestAnimationFrame(this.animate);
  };
}
