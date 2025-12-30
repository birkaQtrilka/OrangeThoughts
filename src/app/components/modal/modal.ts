import {Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';

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

  constructor(private host: ElementRef) {}
  ngOnDestroy(): void {
    this.close();
  }

  open(imagePath: string, caption: string = "") {
    // Save scroll
    this.prevScrollY = window.scrollY || document.documentElement.scrollTop || 0;

    // Show modal
    this.host.nativeElement.style.display = "block";

    // // Lock body in place
    document.body.style.position = "fixed";
    document.body.style.top = `-${this.prevScrollY}px`;
    // document.body.style.left = "0";
    // document.body.style.right = "0";
    // document.body.style.width = "100%";

    this.image.nativeElement.src = imagePath;
    this.caption.nativeElement.innerHTML = caption;
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
  }

  imageClick(event: MouseEvent) {
    event.stopPropagation();
  }
}
