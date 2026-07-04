import { Component, effect, ElementRef, inject, OnInit, QueryList, signal, ViewChild, ViewChildren } from '@angular/core';
import { trigger, transition, animate, style, query, group } from '@angular/animations';
import { CodingAdventure } from '../../models/coding-adventure.model';
import { CODING_BOIDS } from '../../data/adventures/boids.adventure';
import { CODING_DOTS } from '../../data/adventures/dots.adventure';
import { CODING_IK } from '../../data/adventures/ik.adventure';
import { CODING_PATHFINDING } from '../../data/adventures/dungeon.adventure';
import { CODING_PHYSICS } from '../../data/adventures/physics.adventure';
import { CODING_WFC } from '../../data/adventures/wfc.adventure';
import { AdventureArticle } from './adventure-article/adventure-article';
import { TagFilter } from "./tag-filter/tag-filter";
import { RouterLink } from '@angular/router';
import { NavigationList } from "../navigation-list/navigation-list";
import { CODING_BEAT_MAGIC } from '../../data/adventures/beat-magic.adventure';
import { PacmanPaginator } from '../pacman-paginator/pacman-paginator';
import { CODING_PACKAGE_MANAGER } from '../../data/adventures/package-manager.adventure';
import { PaginationService } from '../../services/pagination.service';

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
  providers: [PaginationService],
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
    ])
  ]
})
export class Adventures {
  

  protected adventures: CodingAdventure[] = [
    CODING_DOTS,
    CODING_PHYSICS,
    CODING_IK,
    CODING_PATHFINDING,
    CODING_BEAT_MAGIC,
    CODING_PACKAGE_MANAGER,
    CODING_WFC,
    CODING_BOIDS,
  ];

  @ViewChildren(AdventureArticle, { read: ElementRef })
  articleElements!: QueryList<ElementRef<HTMLElement>>;
  @ViewChild(TagFilter) 
  tagFilter!: TagFilter;

  filteredAdventures = signal([...this.adventures]);
  
  // Custom states for animations
  isFiltering = false; 
  pageAnimationState = 0;

  // Pagination Variables
  protected adventuresPerPage = 4;
  paginatedAdventures = this.adventures.slice(0, this.adventuresPerPage);
  urlPaginationService = inject(PaginationService);

  // Grouped state to strictly trigger @for loop re-renders on page change
  pageData = { state: this.pageAnimationState, adventures: this.paginatedAdventures };

  allTags = Array.from(
    new Set(this.adventures.flatMap(a => a.tags))
  );

  constructor() {
    effect(() => {
      const currentPage = this.urlPaginationService.currentPage();
      const currentFilteredAdventures = this.filteredAdventures(); 

      if(currentPage > currentFilteredAdventures.length) {
        if(currentFilteredAdventures.length > 0) this.urlPaginationService.setPage(currentFilteredAdventures.length - 1);
        return;
      }
      this.updatePaginatedAdventuresArray();   
      this.pageData = { state: this.pageAnimationState, adventures: this.paginatedAdventures };

    });
  }

  updateFilteredAdventures() {
    this.filteredAdventures.set(
      this.tagFilter.applyFilter(
        this.adventures, a => a.tags, a => a.title.toLowerCase())
    );
  }

  updatePaginatedAdventuresArray() {
    const page = this.urlPaginationService.currentPage();
    this.paginatedAdventures = this.filteredAdventures().slice(
      page * this.adventuresPerPage,
      (page + 1) * this.adventuresPerPage
    );
  }

  public onTagFilterChanged() {
    this.isFiltering = true; // Enables shrink/grow animation
    this.updateFilteredAdventures();
    
    this.urlPaginationService.setPage(0);
    
    // We intentionally DO NOT change pageAnimationState here so the wrapper doesn't slide
    this.pageData = { state: this.pageAnimationState, adventures: this.paginatedAdventures };
  }
  
  public onPageChanged(currPage: number) {
    this.isFiltering = false; // Disables shrink/grow animation during sliding

    const oldPage = this.urlPaginationService.currentPage(); 
    if (currPage > oldPage) {
      this.pageAnimationState++;
    } else if (currPage < oldPage) {
      this.pageAnimationState--;
    }
    
    this.urlPaginationService.setPage(currPage);
    // this.updatePaginatedAdventuresArray();
    
    // Changing the state forces Angular to create a new page wrapper, triggering the slide
    // this.pageData = { state: this.pageAnimationState, adventures: this.paginatedAdventures };
  }

  getTotalPages() {
    return Math.ceil(this.filteredAdventures().length / this.adventuresPerPage);
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