import { Injectable, inject } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { TranslocoService } from '@ngneat/transloco';

import { createUiController } from '@app/core/store/ui';
import { userSignInActions, userSignOutActions } from '../actions';

@Injectable()
export class UserUiEffects {

  private actions = inject(Actions);
  private transloco = inject(TranslocoService);
  private ui = createUiController(this.actions, this.transloco);

  startLoader$ = this.ui.startLoaderOn(
    userSignInActions.signIn,
    userSignOutActions.signOut,
  );

  stopLoader$ = this.ui.stopLoaderOn(
    userSignInActions.signInSuccess,
    userSignInActions.signInError,
    userSignOutActions.signOutSuccess,
    userSignOutActions.signOutError,
  );

  showError$ = this.ui.showErrorOn(
    userSignInActions.signInError,
    userSignOutActions.signOutError,
  );

  showSuccess$ = this.ui.showSuccessOn(
    userSignInActions.signInSuccess,
    userSignOutActions.signOutSuccess,
  );
}
