import { Component, inject } from '@angular/core';
import { TranslocoModule } from '@ngneat/transloco';

import { PageHeaderComponent, UserCredentialsFormComponent } from '@app/common/components';
import { Store } from '@ngrx/store';
import { userSignInActions } from '../../store';
import { UserCredentials } from '../../types';

const imports = [
  TranslocoModule,
  PageHeaderComponent,
  UserCredentialsFormComponent,
];

@Component({
  selector: 'app-signin-page',
  standalone: true,
  imports,
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
})
export default class SignInPageComponent {

  private store = inject(Store);

  onSignIn(credentials: UserCredentials) {
    this.store.dispatch(userSignInActions.signIn({ credentials }));
  }
}
