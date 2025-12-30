import { Component } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import { PROJECT_CARDS } from './constants/project-cards.constant';
import { TOOLS } from './constants/tools.constant';
import { ProjectCard } from '../project-card/project-card';
import { SeparationLine } from '../separation-line/separation-line';
import { ContactCard } from '../contact-card/contact-card';
import { ScrollScaleDirective } from '../../directives/scale-scroll.directive';
import { GlossyScrollDirective } from "../../directives/glossy-scroll.directive";

@Component({
  selector: 'app-home',
  imports: [CommonModule, ProjectCard, SeparationLine, ContactCard, ScrollScaleDirective, GlossyScrollDirective, NgOptimizedImage],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {
  protected readonly cards = PROJECT_CARDS;
  protected readonly tools = TOOLS;

}
