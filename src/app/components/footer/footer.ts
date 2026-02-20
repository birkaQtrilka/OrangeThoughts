import {Component, Input} from '@angular/core';

interface FooterLink {
  href: string;
  icon?: string;
  alt?: string;
}


@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.scss'
})
export class Footer {
  @Input() email: string = 'carpeliucstefan@gmail.com';

  socialLinks: FooterLink[] = [
    {
      href: 'https://www.instagram.com/orange.thoughts.dev/',
      icon: 'assets/Images/Icons/instaIcon.png',
      alt: 'Instagram'
    },
    {
      href: 'https://www.linkedin.com/in/stefan-carpeliuc-b2880427b/',
      icon: 'assets/Images/Icons/LinkedInIcon.png',
      alt: 'LinkedIn'
    },
    {
      href: 'https://x.com/Birkator',
      icon: 'assets/Images/Icons/TwitterIcon.png',
      alt: 'Twitter'
    },
    {
      href: 'https://github.com/birkaQtrilka',
      icon: 'assets/Images/Icons/gitHubIcon.png',
      alt: 'GitHub'
    },
    {
      href: 'https://www.youtube.com/channel/UCuIZf3WkVrkOhyHA0Tin4gg',
      icon: 'assets/Images/Icons/icons8-youtube-100.png',
      alt: 'YouTube'
    }
  ];
}
