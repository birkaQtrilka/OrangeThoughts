// scroll-tracker.service.ts
import { Injectable, NgZone, OnDestroy } from '@angular/core';

export interface ScrollTarget {
  el: HTMLElement;
  range: number;
  offset: number;
  onUpdate: (t: number) => void;
}

@Injectable({ providedIn: 'root' })
export class ScrollTrackerService implements OnDestroy {
  private targets = new Set<ScrollTarget>();
  private ticking = false;
  private boundOnScroll = this.onScroll.bind(this);
  private listenerActive = false;

  constructor(private ngZone: NgZone) {}

  register(target: ScrollTarget): () => void {
    this.targets.add(target);
    if (!this.listenerActive) {
      this.ngZone.runOutsideAngular(() => {
        window.addEventListener('scroll', this.boundOnScroll, { passive: true });
      });
      this.listenerActive = true;
    }
    // run once immediately so elements are positioned correctly pre-scroll
    this.scheduleTick();

    return () => {
      this.targets.delete(target);
      if (this.targets.size === 0 && this.listenerActive) {
        window.removeEventListener('scroll', this.boundOnScroll);
        this.listenerActive = false;
      }
    };
  }

  private onScroll(): void {
    this.scheduleTick();
  }

  private scheduleTick(): void {
    if (this.ticking) return;
    this.ticking = true;
    requestAnimationFrame(() => {
      this.ticking = false;
      this.flush();
    });
  }

  private flush(): void {
    const vh = window.innerHeight / 100;

    // 1) READ PHASE — all layout reads happen first, no writes in between
    const reads = Array.from(this.targets).map(target => ({
      target,
      rect: target.el.getBoundingClientRect(),
    }));

    // 2) WRITE PHASE — all writes happen after, layout is stable and cached
    for (const { target, rect } of reads) {
      const offsetPx = target.offset * vh;
      const rangePx = target.range * vh;
      let t = (rect.y + offsetPx) / rangePx;
      t = Math.min(Math.max(t, -1), 1);
      target.onUpdate(t);
    }
  }

  ngOnDestroy(): void {
    if (this.listenerActive) {
      window.removeEventListener('scroll', this.boundOnScroll);
    }
  }
}