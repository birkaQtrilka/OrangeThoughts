import { Component, EventEmitter, Input, Output } from '@angular/core';
import { trigger, transition, animate, style } from '@angular/animations';

@Component({
  selector: 'app-navigation-list',
  standalone: true,
  templateUrl: './navigation-list.html',
  styleUrl: './navigation-list.scss',
  animations: [
    trigger('collapseAnimation', [
      transition(':enter', [
        style({ height: 0, opacity: 0, overflow: 'hidden', scale: 0 }),
        animate('300ms ease-out', style({ height: '*', opacity: 1, overflow: 'visible', scale: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ height: 0, opacity: 0, overflow: 'hidden', scale: 0 }))
      ])
    ])
  ]
})
export class NavigationList {
  @Input() adventures: { title: string }[] = [];

  @Output() selectAdventure = new EventEmitter<number>();

  onClick(index: number) {
    this.selectAdventure.emit(index);
  }
}
