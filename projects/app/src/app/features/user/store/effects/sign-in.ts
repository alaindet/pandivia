import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap, tap } from 'rxjs';

import { DEFAULT_ROUTE } from '@app/app.routes';
import { AuthenticationService } from '../../services';
import { userSignIn } from '../actions';

@Injectable()
export class UserSignInEffects {

  private actions = inject(Actions);
  private router = inject(Router);
  private authService = inject(AuthenticationService);

  signIn$ = createEffect(() => this.actions.pipe(
    ofType(userSignIn.try),
    switchMap(({ credentials }) => this.authService.signIn(credentials).pipe(
      map(user => {
        const message = 'auth.signInSuccess';
        return userSignIn.ok({ user, message });
      }),
      catchError(() => {
        const message = 'auth.signInError';
        return of(userSignIn.err({ message }));
      }),
    )),
  ));

  onSignedIn$ = createEffect(() => this.actions.pipe(
    ofType(userSignIn.ok),
    tap(() => this.router.navigate([DEFAULT_ROUTE])),
  ), { dispatch: false });
}
