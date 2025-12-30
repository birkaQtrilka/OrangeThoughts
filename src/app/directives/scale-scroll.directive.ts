import { Directive, Input, OnInit } from '@angular/core';
import { BaseScrollDirective } from './scroll-range.directive';

@Directive({
  selector: '[scrollScale]' 
})
export class ScrollScaleDirective extends BaseScrollDirective {
  @Input() override range: number = 100;  // 100vh
  @Input() override offset: number = -40;   // -40vh

  override ngOnInit(): void {
    super.ngOnInit();
    this.range = 100; // 100vh
  }

  protected override applyTransformation(t: number): void {
    t = this.clamp(t, 0, 0.5);  
    
    this.renderer.setStyle(this.container, 'transform', `scale(${1 - t})`);
  }
}
