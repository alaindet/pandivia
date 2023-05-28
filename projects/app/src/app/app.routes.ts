import { Routes } from '@angular/router';
import { environment } from '@app/environment';
import { RootPageComponent } from './core';

const DEFAULT_ROUTE = '/list';

let routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: DEFAULT_ROUTE,
  },
  {
    path: '',
    component: RootPageComponent,
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
