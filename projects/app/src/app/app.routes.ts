import { StackedLayoutService } from '@ui/layouts';
import { Routes } from '@angular/router';

import { LoggedPageCollectionComponent } from '@app/core';
import { isAuthenticatedGuard } from './features/user/guards';

export const DEFAULT_ROUTE = '/list';

export const APP_ROUTES: Routes = [
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
