import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { Project } from '../../models/project.model';
import { Location } from '@angular/common';

@Component({
  selector: 'app-project',
  templateUrl: './project.html',
  styleUrl: './project.scss',
  imports: [RouterLink]
})
export class ProjectPage implements  OnInit {
  project: Project | undefined;

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const projectId = params['id'];
      this.project = this.projectService.getProject(projectId);
    });
  }

  goBack(): void {
    this.location.back();
  }
}