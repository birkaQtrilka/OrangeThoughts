import { inject } from '@angular/core';
import { Router, Routes } from '@angular/router';
import { Home } from './components/home/home';
import { ProjectPage } from './components/project/project';
import { Adventures } from './components/adventures/adventures';
import { PROFILES } from './services/profile.service';

const profileRedirects: Routes = PROFILES.map(profile => ({
  path: profile,
  pathMatch: 'full',
  redirectTo: () => inject(Router).parseUrl(`/?profile=${profile}`),
}));

export const routes: Routes = [
  { path: '', component: Home },
  ...profileRedirects,
  { path: 'adventures', component: Adventures },
  { path: 'projects/:id', component: ProjectPage },
];