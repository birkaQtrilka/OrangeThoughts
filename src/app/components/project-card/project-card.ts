import { Component, inject, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import {NgOptimizedImage} from "@angular/common";
import { ProfileService } from '../../services/profile.service';
@Component({
  selector: 'app-project-card',
  imports: [RouterModule, NgOptimizedImage],
  templateUrl: './project-card.html',
  styleUrl: './project-card.scss'
})
export class ProjectCard {
  protected readonly profileService = inject(ProfileService);
  
  @Input() title!: string;
  @Input() imagePath!: string
  @Input() description!: string;
  @Input() route: string | any[] = '/';

}
