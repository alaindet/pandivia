import { Routes } from '@angular/router';

import { LoginPageComponent } from './pages/login/login.component';
import { ProfilePageComponent } from './pages/profile/profile.component';

export const USER_ROUTES: Routes = [
  {
    path: 'login',
    component: LoginPageComponent,
  },
  {
    path: 'profile',
    component: ProfilePageComponent,
  },
];
