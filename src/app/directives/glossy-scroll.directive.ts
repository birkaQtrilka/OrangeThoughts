import { Directive, HostBinding, Input } from '@angular/core';
import { BaseScrollDirective } from './scroll-range.directive';

@Directive({
  selector: '[appGlossyScroll]'
})
export class GlossyScrollDirective extends BaseScrollDirective {

  @Input() override range: number = 100; // 100vh
  @Input() override offset: number = 0; // 0vh

  @HostBinding('class.glossy-container') glossyContainerClass = true;

  private shineEl!: HTMLElement;

  override ngOnInit(): void {
    super.ngOnInit();

    this.range = 100; // 100vh
    this.ensureShineElement();
  }

  private ensureShineElement(): void {
    const existing = this.container.querySelector<HTMLElement>('.glossy-shine');
    if (existing) {
      this.shineEl = existing;
      return;
    }

    this.shineEl = this.renderer.createElement('div');
    this.renderer.addClass(this.shineEl, 'glossy-shine');

    this.renderer.appendChild(this.container, this.shineEl);
  }

  protected override applyTransformation(t: number): void {
    t *= 100;
    if (!this.shineEl) return;

    this.renderer.setStyle(
      this.shineEl,
      'transform',
      `translate(${t}%, ${t}%)`
    );
  }
}
