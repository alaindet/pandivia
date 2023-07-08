import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap, tap } from 'rxjs';

import { AuthenticationService } from '../../services';
import { userSignOutActions } from '../actions';

@Injectable()
export class UserSignOutEffects {

  private actions = inject(Actions);
  private router = inject(Router);
  private authService = inject(AuthenticationService);

  signOut$ = createEffect(() => this.actions.pipe(
    ofType(userSignOutActions.signOut),
    switchMap(() => this.authService.signOut().pipe(
      map(() => {
        const message = 'auth.signOutSuccess';
        return userSignOutActions.signOutSuccess({ message });
      }),
      catchError(() => {
        const message = 'auth.signOutError';
        return of(userSignOutActions.signOutError({ message }));
      }),
    )),
  ));

  onSignedOut$ = createEffect(() => this.actions.pipe(
    ofType(userSignOutActions.signOutSuccess),
    tap(() => this.router.navigate(['/signin'])),
  ), { dispatch: false });
}
