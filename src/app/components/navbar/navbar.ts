import {Component, signal} from '@angular/core';
import {Router} from '@angular/router';
import {NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'my-navbar',
  imports: [
    NgOptimizedImage
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar {
  constructor(private router: Router) {}

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
    const currentUrl = this.router.url;
    
    // If not already on the project page, navigate first
    if (currentUrl !== route) {
      this.router.navigate([route]).then(() => {
        // wait for Angular to finish rendering
        setTimeout(() => this.scrollTo(sectionId, headerOffset), 100);
      });
    } else {
      // If already on the page, just scroll
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
