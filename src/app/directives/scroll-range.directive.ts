import { Directive, ElementRef, Input, OnInit, Renderer2, OnDestroy } from '@angular/core';
import { ScrollTrackerService } from '../services/scroll-tracker.service';

@Directive({
  selector: '[appBaseScroll]'
})
export class BaseScrollDirective implements OnInit, OnDestroy {
  @Input() range: number = 30;
  @Input() offset: number = 0;

  protected container: HTMLElement;
  private unregister: (() => void) | null = null;

  constructor(
    private el: ElementRef,
    protected renderer: Renderer2,
    private scrollTracker: ScrollTrackerService
  ) {
    this.container = el.nativeElement;
  }

  ngOnInit(): void {
    this.unregister = this.scrollTracker.register({
      el: this.container,
      range: this.range,
      offset: this.offset,
      onUpdate: (t) => this.applyTransformation(t),
    });
  }

  ngOnDestroy(): void {
    this.unregister?.();
  }

  protected applyTransformation(t: number): void {
    // implemented by subclasses
  }

  public clamp(num: number, min: number, max: number): number {
    return Math.min(Math.max(num, min), max);
  }
}