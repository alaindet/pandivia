import { Routes } from '@angular/router';
import { environment } from '@app/environment';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/list',
  },
  {
    path: 'list',
    loadComponent: () => import('@app/features/list'),
  },
  {
    path: 'inventory',
    loadComponent: () => import('@app/features/inventory'),
  },

  // This is an example section
  {
    path: 'counter',
    loadChildren: () => import('@app/features/__counter__'),
  },
];

if (!environment.production) {
  routes.push({
    path: 'demo',
    loadChildren: () => import('@app/__demo__'),
  });
}

export const APP_ROUTES = routes;
