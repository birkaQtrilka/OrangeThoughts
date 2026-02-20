import {Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-modal',
  imports: [],
  templateUrl: './modal.html',
  styleUrl: './modal.scss',
  host: {
    '(click)': 'close()'
  }
})
export class Modal implements OnDestroy{
  @ViewChild('image') image!: ElementRef;
  @ViewChild('caption') caption!: ElementRef;

  private prevScrollY = 0;
  private routerSub!: Subscription;
  
  constructor(
    private host: ElementRef,
    private router: Router
  ) {
    this.onEscapeClick = this.onEscapeClick.bind(this);
  
    this.routerSub = this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.close();
      }
    });
  }

  ngOnDestroy(): void {
    this.close();
  }

  open(imagePath: string, caption: string = "") {
    // Save scroll
    this.prevScrollY = window.scrollY || document.documentElement.scrollTop || 0;

    // Show modal
    this.host.nativeElement.style.display = "block";
    document.body.style.position = "fixed";
    document.body.style.top = `-${this.prevScrollY}px`;
    this.host.nativeElement.scrollTop = 0;

    this.image.nativeElement.src = imagePath;
    this.caption.nativeElement.innerHTML = caption;

    document.removeEventListener('keydown', this.onEscapeClick);
    document.addEventListener('keydown', this.onEscapeClick);
  }

  close() {
    // Hide modal
    this.host.nativeElement.style.display = "none";

    // Read stored top, restore scroll
    const scrollY = this.prevScrollY;

    // Unlock body
    document.body.style.position = "";
    document.body.style.top = "";
    // document.body.style.left = "";
    // document.body.style.right = "";

    // Restore scroll position
    window.scrollTo(0, scrollY);
    document.removeEventListener('keydown', this.onEscapeClick);
  }

  imageClick(event: MouseEvent) {
    event.stopPropagation();
  }

  onEscapeClick(ev: KeyboardEvent){
      if(ev.key === 'Escape'){
        this.close();
      }
  }
}
