import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { ProjectPage } from './components/project/project';
import { Adventures } from './components/adventures/adventures';

export const routes: Routes = [
  {
    path: '',
    component: Home,
  },
  {
    path: 'adventures',
    component: Adventures,
  },
  { path: 'projects/:id', component: ProjectPage },
];
