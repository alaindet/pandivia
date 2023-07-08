import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { switchMap, tap } from 'rxjs';

import { selectUserIsAuthenticated, selectUserIsLoaded } from '../store';
import { firstTruthy } from '@app/common/rxjs';

export const isAuthenticatedGuard = () => {

  const router = inject(Router);
  const store = inject(Store);

  return store.select(selectUserIsLoaded).pipe(
    firstTruthy(),
    switchMap(() => store.select(selectUserIsAuthenticated)),
    tap(isAuthenticated => {
      if (!isAuthenticated) {
        router.navigate(['/signin']);
      }
    }),
  );
}
