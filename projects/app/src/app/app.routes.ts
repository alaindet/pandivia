import { Routes } from '@angular/router';

import { environment } from '@app/environment';
import { LoggedPageCollectionComponent } from '@app/core';

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
    path: '',
    component: LoggedPageCollectionComponent,
    canActivate: [], // TODO: Add logged user check
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
  routes = [
    { path: 'demo', loadChildren: () => import('@app/__demo__') },
    ...routes,
  ];
}

export const APP_ROUTES = routes;
