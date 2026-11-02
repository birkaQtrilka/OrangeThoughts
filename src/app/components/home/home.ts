import { Component, computed, inject } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import { PROJECT_CARDS } from './constants/project-cards.constant';
import { TOOLS } from './constants/tools.constant';
import { ProjectCard } from '../project-card/project-card';
import { SeparationLine } from '../separation-line/separation-line';
import { ContactCard } from '../contact-card/contact-card';
import { ScrollScaleDirective } from '../../directives/scale-scroll.directive';
import { ProfileService } from '../../services/profile.service';
import { ABOUT_ME } from './constants/about-me.constant';
import { PROFILE_PROJECTS } from './constants/profile-projects.constant';
type CardData = (typeof PROJECT_CARDS)[number];
const CARDS_BY_ID = new Map<string, CardData>(PROJECT_CARDS.map(card => [card.id, card]));

@Component({
  selector: 'app-home',
  imports: [CommonModule, ProjectCard, SeparationLine, ContactCard, ScrollScaleDirective, NgOptimizedImage],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {
  private readonly profileService = inject(ProfileService);
  protected readonly tools = TOOLS;
  protected readonly aboutHtml = computed(() => ABOUT_ME[this.profileService.active()]);
  protected readonly cards = computed(() =>
    PROFILE_PROJECTS[this.profileService.active()]
      .map(id => CARDS_BY_ID.get(id))
      .filter((card): card is CardData => card !== undefined),
  );

}
