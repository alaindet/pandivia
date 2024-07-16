import { inject } from '@angular/core';
import { Router } from '@angular/router';

import { UserStore } from '../store';

export const isAuthenticatedGuard = () => {

  const router = inject(Router);
  const userStore = inject(UserStore);

  if (userStore.isLoaded() && userStore.isAuthenticated()) {
    return true;
  }

  router.navigate(['/signin']);
  return false;
}
