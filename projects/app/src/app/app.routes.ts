import { Routes } from '@angular/router';

import { environment } from '@app/environment';
import { LoggedPageCollectionComponent } from '@app/core';
import { isAuthenticatedGuard } from './features/user/guards';
import { StackedLayoutService } from './common/layouts';

export const DEFAULT_ROUTE = '/list';

let routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: DEFAULT_ROUTE,
  },
  {
    path: 'signin',
    loadComponent: () => import('@app/features/user/pages/signin'),
  },
  {
    path: 'signup',
    loadComponent: () => import('@app/features/user/pages/signup'),
  },
  {
    path: '',
    component: LoggedPageCollectionComponent,
    canActivate: [isAuthenticatedGuard],
    providers: [StackedLayoutService],
    children: [
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
    ],
  },
  {
    path: '**',
    redirectTo: DEFAULT_ROUTE,
  },
];

if (!environment.production) {

  const demoRoute = {
    path: 'demo',
    loadChildren: () => import('@app/__demo__'),
  };

  routes = [demoRoute, ...routes];
}

export const APP_ROUTES = routes;
