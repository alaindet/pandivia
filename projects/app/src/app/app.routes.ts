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
    loadChildren: () => import('@app/features/list'),
  },
  {
    path: 'inventory',
    loadChildren: () => import('@app/features/inventory'),
  },
  {
    path: 'user',
    loadChildren: () => import('@app/features/user'),
  },
];

if (!environment.production) {
  routes.push({
    path: 'demo',
    loadChildren: () => import('@app/__demo__'),
  });
}

export const APP_ROUTES = routes;
