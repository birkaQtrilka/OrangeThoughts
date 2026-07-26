import { Directive, inject, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { PROJECT_CARDS } from "../components/home/constants/project-cards.constant";

@Directive({
  selector: '[app-hotkeys]',
  standalone: true,

})
export class HotkeysSerivce implements OnInit, OnDestroy {
  
  private router = inject(Router); 

  ngOnInit(): void {
    this.onKeyDown = this.onKeyDown.bind(this);
    document.addEventListener('keydown', this.onKeyDown);
  }
  ngOnDestroy(): void {
    document.removeEventListener('keydown', this.onKeyDown);
  }


  onKeyDown(ev: KeyboardEvent) {
    switch (ev.key) {
      case 'h':
        this.router.navigate(['/']);        
        break;
      case 'a':
        this.router.navigate(['/adventures']);        
        break;
    
      default:
        const res = Number.parseInt(ev.key);
        
        if(res) {
          this.onNumberKey(res);
        }
        break;
    }
  }

  onNumberKey(num: number) {
    const projects = PROJECT_CARDS;
    
    num = this.clamp(num, 0, projects.length);
    
    const p = projects[num];
    const route = p.route.split('/');
    
    this.router.navigate(route);
  }

  clamp(num: number, min: number, max: number): number {
    return Math.min(Math.max(num, min), max);
  }
}