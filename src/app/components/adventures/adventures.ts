import { Component, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { trigger, transition, animate, style, query, group } from '@angular/animations';
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
import { NavigationList } from "../navigation-list/navigation-list";
import { BEAT_MAGIC } from './constants/beat-magic.adventure';
import { PacmanPaginator } from '../../pacman-paginator/pacman-paginator';
import { CODING_PACKAGE_MANAGER } from './constants/package-manager.adventure';

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
    trigger('pageAnimation', [
      transition(':increment', [
        query(':enter', style({ transform: 'translateX(100%)', opacity: 0 }), { optional: true }),
        group([
          query(':leave', [
            animate('400ms ease-in-out', style({ transform: 'translateX(-100%)', opacity: 0 }))
          ], { optional: true }),
          query(':enter', [
            animate('400ms ease-in-out', style({ transform: 'translateX(0)', opacity: 1 }))
          ], { optional: true })
        ])
      ]),
      transition(':decrement', [
        query(':enter', style({ transform: 'translateX(-100%)', opacity: 0 }), { optional: true }),
        group([
          query(':leave', [
            animate('400ms ease-in-out', style({ transform: 'translateX(100%)', opacity: 0 }))
          ], { optional: true }),
          query(':enter', [
            animate('400ms ease-in-out', style({ transform: 'translateX(0)', opacity: 1 }))
          ], { optional: true })
        ])
      ])
    ]),
    trigger('collapseAnimation', [
      transition('void => filter', [
        style({ height: 0, opacity: 0, overflow: 'hidden', scale: 0 }),
        animate('300ms ease-out', style({ height: '*', opacity: 1, scale: 1 }))
      ]),
      transition('filter => void', [
        style({ overflow: 'hidden' }),
        animate('300ms ease-out', style({ height: 0, opacity: 0, scale: 0 }))
      ])
      // Removed the 'noop' transition. The children will be safely 
      // carried out by the parent wrapper's slide animation.
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
    CODING_PACKAGE_MANAGER,
    CODING_WFC,
    CODING_BOIDS,
  ];

  @ViewChildren(AdventureArticle, { read: ElementRef })
  articleElements!: QueryList<ElementRef<HTMLElement>>;
  @ViewChild(TagFilter) 
  tagFilter!: TagFilter;

  filteredAdventures = [...this.adventures];
  
  // Custom states for animations
  isFiltering = false; 
  pageAnimationState = 0;

  // Pagination Variables
  paginator!: PacmanPaginator;
  protected adventuresPerPage = 4;
  protected currentPage = 0;
  paginatedAdventures = this.adventures.slice(0, this.adventuresPerPage);

  // Grouped state to strictly trigger @for loop re-renders on page change
  pageData = { state: this.pageAnimationState, adventures: this.paginatedAdventures };

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
    this.isFiltering = true; // Enables shrink/grow animation
    this.updateFilteredAdventures();
    this.currentPage = 0;
    this.updatePaginatedAdventures();
    
    // We intentionally DO NOT change pageAnimationState here so the wrapper doesn't slide
    this.pageData = { state: this.pageAnimationState, adventures: this.paginatedAdventures };
  }
  
  public onPageChanged(currPage: number) {
    this.isFiltering = false; // Disables shrink/grow animation during sliding

    if (currPage > this.currentPage) {
      this.pageAnimationState++;
    } else if (currPage < this.currentPage) {
      this.pageAnimationState--;
    }

    this.currentPage = currPage;
    this.updatePaginatedAdventures();
    
    // Changing the state forces Angular to create a new page wrapper, triggering the slide
    this.pageData = { state: this.pageAnimationState, adventures: this.paginatedAdventures };
  }

  getTotalPages() {
    return Math.ceil(this.filteredAdventures.length / this.adventuresPerPage);
  }

  public scrollUp() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  scrollToAdventure(index: number) {
    const elements = this.articleElements.toArray();
    const target = elements[index]?.nativeElement;
    if (!target) return;

    const yOffset = -100;
    const y = target.getBoundingClientRect().top + window.pageYOffset + yOffset;

    window.scrollTo({ top: y, behavior: 'smooth' });
  }
}