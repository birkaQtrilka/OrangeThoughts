import {Component, ElementRef, QueryList, ViewChild, ViewChildren} from '@angular/core';
import { trigger, transition, animate, style } from '@angular/animations';
import { CodingAdventure } from '../../models/coding-adventure.model';
import { CODING_BOIDS } from './constants/boids.adventure';
import { CODING_DOTS } from './constants/dots.adventure';
import { CODING_IK } from './constants/ik.adventure';
import { CODING_PATHFINDING } from './constants/dungeon.adventure';
import { CODING_PHYSICS } from './constants/physics.adventure';
import { CODING_WFC } from './constants/wfc.adventure';
import { AdventureArticle } from './adventure-article/adventure-article';
import { TagFilter } from "./tag-filter/tag-filter";
import { RouterLink } from '@angular/router';
import {NavigationList} from "../navigation-list/navigation-list";
import { BEAT_MAGIC } from './constants/beat-magic.adventure';
import { PacmanPaginator } from '../../pacman-paginator/pacman-paginator';

@Component({
  selector: 'app-adventures',
  imports: [
    AdventureArticle,
    TagFilter,
    RouterLink,
    NavigationList,
    PacmanPaginator,
],
  templateUrl: './adventures.html',
  styleUrl: './adventures.scss',
  animations: [
    trigger('collapseAnimation', [
      transition(':enter', [
        style({ height: 0, opacity: 0, overflow: 'hidden', scale: 0 }),
        animate('300ms ease-out', style({ height: '*', opacity: 1, scale: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ height: 0, opacity: 0, scale: 0 }))
      ])
    ])
  ]
})
export class Adventures {

  protected adventures: CodingAdventure[] = [
    CODING_DOTS,
    CODING_PHYSICS,
    CODING_IK,
    CODING_PATHFINDING,
    BEAT_MAGIC,
    CODING_WFC,
    CODING_BOIDS,
  ];
  @ViewChildren(AdventureArticle, { read: ElementRef })
  articleElements!: QueryList<ElementRef<HTMLElement>>;
  @ViewChild(TagFilter) 
  tagFilter!: TagFilter;
  filteredAdventures = [...this.adventures];
  
  // pagination
  paginator!: PacmanPaginator;
  protected adventuresPerPage = 3;
  protected currentPage = 0;
  paginatedAdventures = this.adventures.slice(0, this.adventuresPerPage);

  allTags = Array.from(
    new Set(this.adventures.flatMap(a => a.tags))
  );

  updateFilteredAdventures() {
    this.filteredAdventures = this.tagFilter.applyFilter(
      this.adventures, a => a.tags, a => a.title.toLowerCase());
  }

  updatePaginatedAdventures() {
    this.paginatedAdventures = this.filteredAdventures.slice(
      this.currentPage * this.adventuresPerPage,
      (this.currentPage + 1) * this.adventuresPerPage
    );
  }

  public onTagFilterChanged() {
    this.updateFilteredAdventures();
    this.currentPage = 0;
    this.updatePaginatedAdventures();
  }
  
  public onPageChanged(currPage: number) {
    this.currentPage = currPage;
    this.updatePaginatedAdventures();
  }

  getTotalPages() {
    return Math.ceil(this.filteredAdventures.length / this.adventuresPerPage);
  }

  public scrollUp() {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  scrollToAdventure(index: number) {
    const elements = this.articleElements.toArray();
    const target = elements[index]?.nativeElement;
    if (!target) {
      return;
    }

    const yOffset = -100;
    const y =
      target.getBoundingClientRect().top +
      window.pageYOffset +
      yOffset;

    window.scrollTo({ top: y, behavior: 'smooth' });
  }
}
