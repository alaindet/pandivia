import { inject } from '@angular/core';
import { RedirectCommand, Router } from '@angular/router';

import { UserStore } from '../store';
import { map } from 'rxjs';

export const isAuthenticatedGuard = () => {

  const router = inject(Router);
  const userStore = inject(UserStore);

  return userStore.isAppStableAndAuthenticated.pipe(
    map(isAuthenticated => {
      if (!isAuthenticated) {
        const urlTree = router.parseUrl('/signin');
        return new RedirectCommand(urlTree, { skipLocationChange: false });
      }
      return isAuthenticated;
    }),
  );
}
