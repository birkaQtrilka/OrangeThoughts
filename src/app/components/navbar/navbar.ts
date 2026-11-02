import {Component, inject, signal} from '@angular/core';
import {Router} from '@angular/router';
import {NgOptimizedImage} from "@angular/common";
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'my-navbar',
  imports: [
    NgOptimizedImage
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar {
  private readonly router = inject(Router);
  private readonly profileService = inject(ProfileService);

  navButtons = signal([
    {
      text: "About",
      icon: "badge",
      onClick: () => this.navigate("/", "AboutMe")
    },
    {
      text: "Projects",
      icon: "work",
      onClick: () => this.navigate("/", "Projects")
    },
    {
      text: "Adventures",
      icon: "hiking",
      onClick: () => { this.navigate("/adventures", "AdventuresSection", 300) },
    },
  ]);


  public navigate(route: string, sectionId: string, headerOffset: number = 100) {
    const currentPath = this.router.url.split(/[?#]/)[0];
    const targetPath = route === '' ? '/' : route;

    if (currentPath !== targetPath) {
      // Replaces query params: keeps `profile`, drops `page` and anything else.
      this.router
        .navigate([targetPath], { queryParams: this.profileService.queryParams() })
        .then(() => {
          setTimeout(() => this.scrollTo(sectionId, headerOffset), 100);
        });
    } else {
      this.scrollTo(sectionId, headerOffset);
    }
  }

  private scrollTo(sectionId: string, headerOffset: number = 100) {
    const projectsSection = document.getElementById(sectionId);
    if (!projectsSection) return;

    const elementPosition = projectsSection.getBoundingClientRect().top + window.scrollY;
    const offsetPosition = elementPosition - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth"
    });
  }
}
