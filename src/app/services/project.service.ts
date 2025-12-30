import { Injectable } from '@angular/core';
import { Project } from '../models/project.model';
import { DomSanitizer } from '@angular/platform-browser';
import { PROJECT_PROCEDURAL_PLANETS } from './projects/procedural-planets.project';
import { PROJECT_BALL_BLAZE } from './projects/ball-blaze.project';
import { PROJECT_PROCEDURAL_GENERATION } from './projects/procedural-generation.project';
import { PROJECT_UNITY_EDITOR } from './projects/unity-editor.project';
import { PROJECT_INTERNSHIP_TIBLE } from './projects/internship-tible.project';
import { PROJECT_FRONT_END } from './projects/front-end.project';
import { PROJECT_CPP_PROJECTS } from './projects/cppProjects.project';
import { PROJECT_NETWORKING } from './projects/networking.project';

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

    ];
  }


  getProject(id: string): Project | undefined {
    return this.projects.find(p => p.id === id);
  }

  getAllProjects(): Project[] {
    return this.projects;
  }
}