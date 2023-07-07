import { Routes } from '@angular/router';

import { ProfilePageComponent } from './pages/profile/profile.component';

export const USER_ROUTES: Routes = [
  {
    path: 'profile',
    component: ProfilePageComponent,
  },
];
