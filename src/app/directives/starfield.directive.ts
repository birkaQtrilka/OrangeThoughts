import { Directive, Input, OnDestroy, OnInit, NgZone } from '@angular/core';

interface Star {
  x: number;
  y: number;
  opacity: number;
  twinkleSpeed: number;
  scrollFactor: number;

  sizeIndex: number;

  rotationAngle: number;
  rotationSpeed: number;
}


@Directive({
  selector: '[appStarfield]',
  standalone: true,
})
export class StarfieldDirective implements OnInit, OnDestroy {
  @Input() starCount = 500;
  @Input() parallax = 0.007;
  @Input() resizeDebounce = 200;

  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private animationId = 0;

  private stars: Star[] = [];
  private starSprites: HTMLCanvasElement[] = [];

  private canvasWidth = 0;
  private canvasHeight = 0;
  private lastScrollValue = 0;

  private resizeObserver!: ResizeObserver;
  private resizeTimeout?: number;

  private isMobile = false;
  private lastFrame = 0;

  private readonly spriteSizes = [2, 3, 4, 6];
  private readonly ROTATION_STEPS = 16;

  constructor(private zone: NgZone) {}

  ngOnInit(): void {
    this.isMobile = this.detectMobile();
    if (this.isMobile) {
      this.starCount = Math.min(this.starCount, 150);
    }
    this.createCanvas();
  }

  ngOnDestroy(): void {
    if (this.animationId) cancelAnimationFrame(this.animationId);
    this.resizeObserver?.disconnect();
    if (this.resizeTimeout) clearTimeout(this.resizeTimeout);
    window.removeEventListener('resize', this.resizeHandler);
    if (this.canvas?.parentElement) {
      this.canvas.parentElement.removeChild(this.canvas);
    }
  }


  private createCanvas(): void {
    this.lastScrollValue = window.scrollY;

    this.canvas = document.createElement('canvas');
    Object.assign(this.canvas.style, {
      position: 'fixed',
      inset: '0',
      pointerEvents: 'none',
    } as CSSStyleDeclaration);

    document.body.querySelector<HTMLElement>('.wrapper')?.prepend(this.canvas);

    const ctx = this.canvas.getContext('2d');
    if (!ctx) return;
    this.ctx = ctx;

    this.resizeCanvas();
    this.createStarSprites();
    this.initStars();

    this.resizeObserver = new ResizeObserver(() => this.scheduleResize());
    this.resizeObserver.observe(document.body);
    window.addEventListener('resize', this.resizeHandler);

    this.zone.runOutsideAngular(() => {
      this.animationId = requestAnimationFrame(this.animateStars);
    });
  }

  private createStarSprites(): void {
    this.starSprites.length = 0;

    for (const size of this.spriteSizes) {
      const glow = Math.max(4, size * 1.5);
      const pad = glow * 2;
      const baseSize = size + pad;
      const center = baseSize / 2;

      for (let i = 0; i < this.ROTATION_STEPS; i++) {
        const angle = (i / this.ROTATION_STEPS) * Math.PI * 2;

        const c = document.createElement('canvas');
        c.width = c.height = baseSize;
        const ctx = c.getContext('2d')!;

        ctx.clearRect(0, 0, baseSize, baseSize);

        // bake glow once
        ctx.shadowBlur = glow;
        ctx.shadowColor = 'rgba(255,255,255,0.9)';

        ctx.translate(center, center);
        ctx.rotate(angle);

        ctx.fillStyle = 'white';
        ctx.fillRect(-size / 2, -size / 2, size, size);

        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.shadowBlur = 0;

        this.starSprites.push(c);
      }
    }
  }

private initStars(): void {
  this.stars.length = 0;

  for (let i = 0; i < this.starCount; i++) {
    const sizeIndex = Math.floor(Math.random() * this.spriteSizes.length);
    const size = this.spriteSizes[sizeIndex];

    this.stars.push({
      x: Math.random() * this.canvasWidth,
      y: Math.random() * this.canvasHeight,
      opacity: Math.random(),
      twinkleSpeed: Math.random() * 0.003 + 0.001,
      scrollFactor: size * size * this.parallax,

      sizeIndex,
      rotationAngle: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() * 0.6 + 0.2) * (Math.random() < 0.5 ? -1 : 1),
      // radians per second (slow!)
    });
  }
}


private animateStars = (time: number) => {
  const dt = this.lastFrame
    ? (time - this.lastFrame) / 1000
    : 0;
  this.lastFrame = time;

  // optional mobile fps cap
  if (this.isMobile && dt < 0.03) {
    this.animationId = requestAnimationFrame(this.animateStars);
    return;
  }

  const ctx = this.ctx;
  const w = this.canvasWidth;
  const h = this.canvasHeight;

  ctx.clearRect(0, 0, w, h);

  const scrollY = window.scrollY || 0;
  const deltaScroll = scrollY - this.lastScrollValue;
  this.lastScrollValue = scrollY;

  for (const star of this.stars) {
    // twinkle
    star.opacity += star.twinkleSpeed;
    if (star.opacity > 1 || star.opacity < 0.2) {
      star.twinkleSpeed *= -1;
    }

    // smooth rotation (time-based)
    star.rotationAngle += star.rotationSpeed * dt;

    const normalized =
      (star.rotationAngle % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);

    const rotationStep = Math.floor(
      (normalized / (Math.PI * 2)) * this.ROTATION_STEPS
    );

    const spriteIndex =
      star.sizeIndex * this.ROTATION_STEPS + rotationStep;

    // parallax
    star.y -= deltaScroll * star.scrollFactor;
    if (star.y < 0) star.y += h;
    else if (star.y > h) star.y -= h;

    ctx.globalAlpha = star.opacity;
    const sprite = this.starSprites[spriteIndex];
    ctx.drawImage(
      sprite,
      star.x - sprite.width / 2,
      star.y - sprite.height / 2
    );
  }

  ctx.globalAlpha = 1;
  this.animationId = requestAnimationFrame(this.animateStars);
};


  private scheduleResize(): void {
    if (this.resizeTimeout) clearTimeout(this.resizeTimeout);
    this.resizeTimeout = window.setTimeout(() => {
      this.resizeCanvas();
      this.createStarSprites();
      this.initStars();
      this.resizeTimeout = undefined;
    }, this.resizeDebounce);
  }

  private resizeCanvas(): void {
    const cssWidth = document.documentElement.clientWidth;
    const cssHeight = Math.max(document.body.scrollHeight, window.innerHeight);

    this.canvasWidth = cssWidth;
    this.canvasHeight = cssHeight;

    const dpr = this.isMobile
      ? Math.min(1.5, window.devicePixelRatio || 1)
      : window.devicePixelRatio || 1;

    this.canvas.width = Math.floor(cssWidth * dpr);
    this.canvas.height = Math.floor(cssHeight * dpr);
    this.canvas.style.width = cssWidth + 'px';
    this.canvas.style.height = cssHeight + 'px';

    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  private detectMobile(): boolean {
    return (
      /Android|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(navigator.userAgent) ||
      window.innerWidth < 768
    );
  }

  private resizeHandler = () => this.scheduleResize();
}
