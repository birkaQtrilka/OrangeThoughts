import { Component, computed, input, model } from '@angular/core';

export type JustifyContent = 
  | 'flex-start' 
  | 'flex-end' 
  | 'center' 
  | 'space-between' 
  | 'space-around' 
  | 'space-evenly';

@Component({
  selector: 'app-pacman-paginator',
  imports: [],
  templateUrl: './pacman-paginator.html',
  styleUrl: './pacman-paginator.scss'
})
export class PacmanPaginator {
  currPage = model<number>(0);
  totalPages = input<number>(1);

  protected range = computed<number[]>(() => Array.from({ length: this.totalPages() }));

  // style props
  justifyContent = input<JustifyContent>('flex-start'); 

  protected btnClick(index: number) {
    this.currPage.set(index);
  }
}
