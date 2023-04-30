import { Routes } from '@angular/router';
import { environment } from '@app/environment';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/lists',
  },
  {
    path: 'lists',
    loadChildren: () => import('@app/features/lists')
      .then(m => m.LISTS_ROUTES),
  },
  {
    path: 'lists/:listid/items',
    loadComponent: () => import('@app/features/items')
      .then(m => m.ItemsFeatureComponent),
  },
];

if (!environment.production) {
  routes.push({
    path: 'demo',
    loadChildren: () => import('@app/__demo__')
      .then(m => m.DEMO_ROUTES),
  });
}

export const APP_ROUTES = routes;
