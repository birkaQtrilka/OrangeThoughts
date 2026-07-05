import { Injectable } from '@angular/core';
import { Project } from '../models/project.model';
import { DomSanitizer } from '@angular/platform-browser';
import { PROJECT_PROCEDURAL_PLANETS } from '../data/projects/procedural-planets.project';
import { PROJECT_BALL_BLAZE } from '../data/projects/ball-blaze.project';
import { PROJECT_PROCEDURAL_GENERATION } from '../data/projects/procedural-generation.project';
import { PROJECT_UNITY_EDITOR } from '../data/projects/unity-editor.project';
import { PROJECT_INTERNSHIP_TIBLE } from '../data/projects/internship-tible.project';
import { PROJECT_FRONT_END } from '../data/projects/front-end.project';
import { PROJECT_CPP_PROJECTS } from '../data/projects/cppProjects.project';
import { PROJECT_NETWORKING } from '../data/projects/networking.project';
import { PROJECT_PROPOSALS_PLEASE } from '../data/projects/proposals-please.project';
import { PROJECT_THE_MILLER } from '../data/projects/the-miller.project';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private projects: Project[];

  constructor(private sanitizer: DomSanitizer) {

    // Start with some projects imported from separate files and sanitized as needed
    const transform = (raw: any): Project => {
      const vp = raw.videoPath
        ? {
            isIframe: raw.videoPath.isIframe,
            path: raw.videoPath.isIframe
              ? this.sanitizer.bypassSecurityTrustResourceUrl(raw.videoPath.path)
              : raw.videoPath.path,
            hideOnMobile: raw.videoPath.hideOnMobile
          }
        : undefined;

      return {
        ...raw,
        videoPath: vp,
      } as Project;
    };

    this.projects = [
      transform(PROJECT_BALL_BLAZE),
      transform(PROJECT_PROCEDURAL_PLANETS),
      transform(PROJECT_PROCEDURAL_GENERATION),
      transform(PROJECT_CPP_PROJECTS),
      transform(PROJECT_FRONT_END),
      transform(PROJECT_INTERNSHIP_TIBLE),
      transform(PROJECT_UNITY_EDITOR),
      transform(PROJECT_NETWORKING),
      transform(PROJECT_PROPOSALS_PLEASE),
      transform(PROJECT_THE_MILLER),

    ];
  }


  getProject(id: string): Project | undefined {
    return this.projects.find(p => p.id === id);
  }

  getAllProjects(): Project[] {
    return this.projects;
  }
}