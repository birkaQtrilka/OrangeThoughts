import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { Project } from '../../models/project.model';
import { Location } from '@angular/common';
import { GitService } from '../../services/git.service';
import { ImageSlider } from '../image-slider/image-slider';

@Component({
  selector: 'app-project',
  templateUrl: './project.html',
  styleUrl: './project.scss',
  imports: [ImageSlider]
})
export class ProjectPage implements  OnInit {

  project: Project | undefined;
  protected lastModified: string = '';
  empty: string[] = [];
  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private location: Location,
    private githubService: GitService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const projectId = params['id'];
      this.project = this.projectService.getProject(projectId);
    });

    var repoData = this.githubService.extractOwnerRepo(this.project?.githubLink);
    if (repoData) {
      this.githubService
      .getLastUpdated(repoData?.owner, repoData.repo)
      .subscribe(date => {
        this.lastModified = new Date(date.updated_at).toLocaleDateString();
      });
    }
    
  }

  goBack(): void {
    this.location.back();
  }

  isMobile(): boolean {
    return window.innerWidth <= 768;
  }

  getImages(): string[] {
    if(this.project?.images) return this.project.images;
    return this.empty;
  }
}