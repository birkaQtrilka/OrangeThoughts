import { Directive, ElementRef, Input, OnInit, Renderer2, OnDestroy } from '@angular/core';

@Directive({
  selector: '[appBaseScroll]'
})
export class BaseScrollDirective implements OnInit, OnDestroy {
  @Input() range: number = 30;  // 30vh
  @Input() offset: number = 0;  // 0vh  
  
  protected container: HTMLElement;
  private scrollListener: () => void = () => {};

  constructor(private el: ElementRef, protected renderer: Renderer2) {
    this.container = el.nativeElement;
  }

  ngOnInit(): void {
    this.scrollListener = this.setupScrollListener();
    window.addEventListener('scroll', this.scrollListener);
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.scrollListener);
  }

  private setupScrollListener() {
    return () => {
      const rect = this.container.getBoundingClientRect();
      const vh = window.innerHeight / 100;
      const offsetPx = this.offset * vh;
      const rangePx = this.range * vh;
      let t = (rect.y + offsetPx) / rangePx;
      t = this.clamp(t, -1, 1);
      this.applyTransformation(t);
    };
  }

  protected applyTransformation(t: number): void {
    // To be implemented in inheriting directives
  }

  public clamp(num: number, min: number, max: number): number {
    return Math.min(Math.max(num, min), max);
  }
}
