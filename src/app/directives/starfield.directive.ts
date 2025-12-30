import { Directive, Input, OnDestroy, OnInit, NgZone } from '@angular/core';

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  rotation: number;
  rotSpeed: number;
  twinnkleSpeed: number;
  scrollFactor: number;
  opasityChange: { min: number; max: number };
}

@Directive({
  selector: '[appStarfield]',
  standalone: true,
})
export class StarfieldDirective implements OnInit, OnDestroy {
  @Input() starCount = 500;
  @Input() minSize = 1;
  @Input() maxSize = 7;
  @Input() parallax = 0.007;
  @Input() excludeSelector = '.starAvoid';
  @Input() resizeDebounce = 200; // ms to wait after resize end

  private stars: Star[] = [];
  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private animationId = 0;
  private lastScrollValue = 0;
  private resizeObserver!: ResizeObserver;
  private starExceptions: HTMLElement[] = [];
  private canvasWidth = 0; // logical CSS pixels
  private canvasHeight = 0; // logical CSS pixels
  private resizeTimeout?: number;

  // speed ranges
  private rotationSpeed = { min: 0.001, max: 0.006 };
  private twinnkleSpeed = { min: 0.001, max: 0.003 };
  private opasityChange = { min: 0.2, max: 1 };

  constructor(private zone: NgZone) {}

  ngOnInit(): void {
    this.createCanvas();
  }

  ngOnDestroy(): void {
    if (this.animationId) cancelAnimationFrame(this.animationId);
    try { window.removeEventListener('resize', this.resizeHandler); } catch {}
    try { window.removeEventListener('scroll', this.scrollHandler); } catch {}
    if (this.resizeObserver) this.resizeObserver.disconnect();
    if (this.resizeTimeout) window.clearTimeout(this.resizeTimeout);
    if (this.canvas && this.canvas.parentElement) this.canvas.parentElement.removeChild(this.canvas);
  }

  // create and configure canvas, then initialize stars and start animation outside Angular zone
  private createCanvas(): void {
    this.lastScrollValue = window.scrollY;
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'starCanvas';
    // ensure the canvas doesn't capture pointer events and stays behind UI
    Object.assign(this.canvas.style, {
      position: 'fixed',
      left: '0',
      top: '0',
      pointerEvents: 'none',
      // zIndex: '-1',
    } as any);

    document.body.querySelector<HTMLElement>('.wrapper')?.prepend(this.canvas);

    const maybeCtx = this.canvas.getContext('2d');
    if (!maybeCtx) return;
    this.ctx = maybeCtx;

    // query exclusions
    this.starExceptions = Array.from(document.querySelectorAll<HTMLElement>(this.excludeSelector || '.starAvoid'));

    // set sizes and observe (debounced)
    this.resizeCanvas();
    this.resizeObserver = new ResizeObserver(() => this.scheduleResize());
    this.resizeObserver.observe(document.body);
    window.addEventListener('resize', this.resizeHandler);
    window.addEventListener('scroll', this.scrollHandler, { passive: true });

    this.initStars(this.starCount, this.minSize, this.maxSize);

    // run animation outside Angular to avoid change detection churn
    this.zone.runOutsideAngular(() => {
      this.animationId = requestAnimationFrame(() => this.animateStars());
    });
  }

  // helpers
  private exp(x: number) { return x * x; }
  private randomInt(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min; }

  private isPointInsideElement(x: number, y: number, element: HTMLElement) {
    const rect = element.getBoundingClientRect();
    const canvasRect = this.canvas.getBoundingClientRect();
    const adjustedX = x + canvasRect.left;
    const adjustedY = y + canvasRect.top;
    return (
      adjustedX >= rect.left &&
      adjustedX <= rect.right &&
      adjustedY >= rect.top &&
      adjustedY <= rect.bottom
    );
  }

  private initStars(count: number, minS: number, maxS: number) {
    this.stars.length = 0;
    for (let i = 0; i < count; i++) {
      const x = Math.random() * this.canvasWidth;
      const y = Math.random() * this.canvasHeight;
      const size = Math.random() * maxS + minS;
      const op1 = Math.random() * this.opasityChange.max + this.opasityChange.min;
      const op2 = Math.random() * this.opasityChange.max + this.opasityChange.min;
      this.stars.push({
        x,
        y,
        size,
        opacity: Math.random(),
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() * this.rotationSpeed.max + this.rotationSpeed.min) * (this.randomInt(0, 1) === 0 ? 1 : -1),
        twinnkleSpeed: (Math.random() * this.twinnkleSpeed.max + this.twinnkleSpeed.min),
        scrollFactor: this.exp(size) * this.parallax,
        opasityChange: { min: Math.min(op1, op2), max: Math.max(op1, op2) },
      });
    }
    // ensure stars avoid specified elements
    this.resetStars(this.starExceptions);
  }

  private resetStars(exceptions: HTMLElement[]) {
    this.stars.forEach(s => {
      let x: number;
      let y: number;
      let attempts = 0;
      do {
        x = Math.random() * this.canvasWidth;
        y = Math.random() * this.canvasHeight;
        attempts++;
        // safety bail
        if (attempts > 100) break;
      } while (exceptions.some(e => this.isPointInsideElement(x, y, e)));
      s.x = x;
      s.y = y;
    });
  }

  // debounce resize so heavy work runs only after resize end
  private scheduleResize() {
    if (this.resizeTimeout) window.clearTimeout(this.resizeTimeout);
    this.resizeTimeout = window.setTimeout(() => {
      this.resizeCanvas();
      this.resizeTimeout = undefined;
    }, this.resizeDebounce);
  }

  private animateStars = () => {
    if (!this.ctx || !this.canvas) return;
    // clear using logical CSS pixels; ctx transform already maps logical -> device pixels
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    const scrollY = window.scrollY || window.pageYOffset || 0;
    const scrollYDelta = scrollY - this.lastScrollValue;
    this.lastScrollValue = scrollY;

    for (let star of this.stars) {
      star.opacity += star.twinnkleSpeed;
      star.rotation += star.rotSpeed;
      star.y += -scrollYDelta * star.scrollFactor;
      if (star.opacity > star.opasityChange.max || star.opacity < star.opasityChange.min) star.twinnkleSpeed *= -1;

      if (this.starExceptions.some(e => this.isPointInsideElement(star.x, star.y, e))) continue;

      const size = star.size;
      this.ctx.save();
      this.ctx.translate(star.x, star.y);
      this.ctx.scale(star.opacity + 0.2, star.opacity + 0.2);
      this.ctx.rotate(star.rotation);
      this.ctx.fillStyle = `rgba(255,255,255,${star.opacity})`;
      this.ctx.shadowBlur = 10;
      this.ctx.shadowColor = `rgba(255,255,255,${star.opacity})`;
      this.ctx.fillRect(-size / 2, -size / 2, size, size);
      this.ctx.restore();
    }

    this.animationId = requestAnimationFrame(this.animateStars);
  };

  private resizeCanvas = () => {
    // compute logical CSS pixel size
    const cssWidth = document.documentElement.clientWidth;
    const cssHeight = Math.max(document.body.scrollHeight, window.innerHeight);
    this.canvasWidth = cssWidth;
    this.canvasHeight = cssHeight;

    const ratio = window.devicePixelRatio || 1;
    // set actual backing store size in device pixels
    this.canvas.width = Math.max(1, Math.floor(cssWidth * ratio));
    this.canvas.height = Math.max(1, Math.floor(cssHeight * ratio));
    // set CSS size so element is not stretched
    this.canvas.style.width = cssWidth + 'px';
    this.canvas.style.height = cssHeight + 'px';

    // set transform so drawing operations use logical CSS pixels coordinates
    this.ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

    // re-position stars to avoid excluded elements
    this.starExceptions = Array.from(document.querySelectorAll<HTMLElement>(this.excludeSelector || '.starAvoid'));
    this.resetStars(this.starExceptions);
  };

  // handlers to keep stable references for add/remove
  private resizeHandler = () => this.scheduleResize();
  private scrollHandler = () => { /* nothing needed, we read scroll in animation loop */ };
}
