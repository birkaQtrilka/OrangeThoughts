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

@Component({
  selector: 'app-adventures',
  imports: [
    AdventureArticle,
    TagFilter,
    RouterLink,
    NavigationList
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
    CODING_BOIDS,
    CODING_DOTS,
    CODING_IK,
    CODING_PATHFINDING,
    CODING_PHYSICS,
    CODING_WFC,
  ];
  @ViewChildren(AdventureArticle, { read: ElementRef })
  articleElements!: QueryList<ElementRef<HTMLElement>>;
  @ViewChild(TagFilter) tagFilter!: TagFilter;
  filteredAdventures = [...this.adventures];

  allTags = Array.from(
    new Set(this.adventures.flatMap(a => a.tags))
  );

  public onTagFilterChanged() {
    this.filteredAdventures = this.tagFilter.applyFilter(
      this.adventures, a => a.tags, a => a.title.toLowerCase());
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
