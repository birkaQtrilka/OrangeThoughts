import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideEnvironmentInitializer,
         provideZoneChangeDetection, inject } from '@angular/core';
import { provideRouter, Router, NavigationEnd } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { filter, map, pairwise } from 'rxjs';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes), // no router-level scrolling
    provideAnimations(),
    provideHttpClient(),

    // Scroll to top only when the route path changes (ignores ?page, ?focus, ?profile, #fragment)
    provideEnvironmentInitializer(() => {
      inject(Router).events.pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        map(e => e.urlAfterRedirects.split(/[?#]/)[0]),
        pairwise(), // skips the very first navigation, so a direct link to ?focus=... isn't reset
        filter(([prev, curr]) => prev !== curr),
      ).subscribe(() => window.scrollTo({ top: 0, behavior: 'auto' }));
    }),
  ],
};