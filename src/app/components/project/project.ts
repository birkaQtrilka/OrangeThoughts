import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { Project } from '../../models/project.model';
import { RouterModule } from '@angular/router';

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
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const projectId = params['id'];
      this.project = this.projectService.getProject(projectId);
    });
  }

}