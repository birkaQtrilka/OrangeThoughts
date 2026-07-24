import { Component, inject, input } from '@angular/core';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-image-slider',
  imports: [],
  templateUrl: './image-slider.html',
  styleUrl: './image-slider.scss',
})
export class ImageSlider {
  images = input<string[]>([])
  modalService = inject(ModalService);
  
  currentIndex: number = 0;

  next() {
    this.currentIndex =
      (this.currentIndex + 1) % this.images().length;
  }

  previous() {
    this.currentIndex =
      (this.currentIndex - 1 + this.images().length) %
      this.images().length;
  }
}
