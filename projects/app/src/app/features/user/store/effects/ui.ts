import { Injectable, inject } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { TranslocoService } from '@ngneat/transloco';

import { createUiController } from '@app/core/ui';
import { userSignIn, userSignOut } from '../actions';

@Injectable()
export class UserUiEffects {

  private actions = inject(Actions);
  private transloco = inject(TranslocoService);
  private ui = createUiController(this.actions, this.transloco);

  startLoader$ = this.ui.startLoaderOn(
    userSignIn.try,
    userSignOut.try,
  );

  stopLoader$ = this.ui.stopLoaderOn(
    ...[userSignIn.ok, userSignIn.err],
    ...[userSignOut.ok, userSignOut.err],
  );

  showError$ = this.ui.showErrorOn(
    userSignIn.err,
    userSignOut.err,
  );

  showSuccess$ = this.ui.showSuccessOn(
    userSignIn.ok,
    userSignOut.ok,
  );
}
