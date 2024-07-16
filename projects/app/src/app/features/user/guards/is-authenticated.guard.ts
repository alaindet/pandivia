import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { switchMap, tap } from 'rxjs';

import { UserStoreFeatureService } from '../store';
import { firstTruthy } from '@app/common/rxjs';
import { toObservable } from '@angular/core/rxjs-interop';

export const isAuthenticatedGuard = () => {

  const router = inject(Router);
  const userStore = inject(UserStoreFeatureService);

  return toObservable(userStore.isLoaded).pipe(
    firstTruthy(),
    switchMap(() => toObservable(userStore.isAuthenticated)),
    tap(isAuthenticated => {
      if (!isAuthenticated) {
        router.navigate(['/signin']);
      }
    }),
  );
}
