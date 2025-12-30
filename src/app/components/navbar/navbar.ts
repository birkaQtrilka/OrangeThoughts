import {Component, signal} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'my-navbar',
  imports: [
    RouterLink,
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
      route: '',
      onClick: () => this.navigate("", "AboutMe")
    },
    {
      text: "Projects",
      route: '',
      onClick: () => this.navigate("", "Projects")
    },
    {
      text: "Adventures",
      route: 'adventures',
      onClick: () => {window.scrollTo({ top: 0,behavior: "instant"})},
    },
  ]);


  public navigate(route: string, sectionId: string) {
    const currentUrl = this.router.url;

    // If not already on the project page, navigate first
    if (currentUrl !== route) {
      this.router.navigate([route]).then(() => {
        // wait for Angular to finish rendering
        setTimeout(() => this.scrollTo(sectionId), 100);
      });
    } else {
      // If already on the page, just scroll
      this.scrollTo(sectionId);
    }
  }

  private scrollTo(sectionId: string) {
    const projectsSection = document.getElementById(sectionId);
    if (!projectsSection) return;

    const headerOffset = 80;
    const elementPosition = projectsSection.getBoundingClientRect().top + window.scrollY;
    const offsetPosition = elementPosition - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth"
    });
  }
}
