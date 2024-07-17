import { inject } from '@angular/core';
import { Router } from '@angular/router';

import { UserStore } from '../store';
import { tap } from 'rxjs';

export const isAuthenticatedGuard = () => {

  const router = inject(Router);
  const userStore = inject(UserStore);

  return userStore.isAppStableAndAuthenticated.pipe(
    tap(isAuthenticated => {
      if (!isAuthenticated) {
        router.navigate(['/signin']);
      }
    }),
  );
}
