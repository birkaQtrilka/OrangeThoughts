import {Component, inject, input, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ModalService} from "../../../services/modal.service";
import { GitService } from '../../../services/git.service';
import { VideoPath } from '../../../models/video-path.model';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-adventure-article',
  imports: [
    CommonModule
  ],
  templateUrl: './adventure-article.html',
  styleUrl: './adventure-article.scss'
})
export class AdventureArticle implements OnInit{
  title = input("Boid")
  videoPath = input<VideoPath>({isIframe: true, path: "assets/videos/boids.mp4" });
  tags = input(["#Side-project", "C#"]);
  description = input(`
  &emsp; Because the Unity Data Oriented Technology Stack was released, I decided to learn it by doing a project. I use the
     earlier learned <a href="Coding adventures.html#Boids">Boids Algorithm</a> as the problem to optimize. However, this time
     I use an easier space partitioning algorithm, so I can focus more on how DOTS works. The way it works is that a region in
     space has its hash code that is used as a key in a HashTable. The limitation is that boids interact only in the bounds of a
     particular cell and not in their respective perception radius.
     <br>&emsp; The main challenge I encountered was to find the right documentation to learn from. Many tutorials use deprecated
     functions and even workflows.
  `);
  timeSpent = input("5 days"); // should be a number that is later parsed
  imagePaths = input(['/assets/Images/sideProjects/Boids.png']);
  githubLink = input("https://github.com/birkaQtrilka/BoidsWithDOTS/blob/main/Assets/BoidSystem.cs");
  protected lastModified = '';
  protected sanitizer = inject(DomSanitizer);
  
  constructor(
    protected modalService: ModalService,
    private githubService: GitService
    
  ) {
  }
  ngOnInit(): void {
    var repoData = this.githubService.extractOwnerRepo(this.githubLink());
    if (repoData) {
      this.githubService
        .getLastUpdated(repoData?.owner, repoData.repo)
        .subscribe({
          next: date => {
            this.lastModified = new Date(date.updated_at).toLocaleDateString();
          },
          error: err => {
            console.error('Failed to fetch last updated date from GitHub', err);
            this.lastModified = '';
          }
        });
    }
  }

}

