import { Component, inject } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';

import {
  PageHeaderComponent,
  UserCredentialsFormComponent,
} from '@app/common/components';
import { UserStore } from '../../store';
import { UserCredentials } from '../../types';

@Component({
  selector: 'app-signin-page',
  imports: [TranslocoModule, PageHeaderComponent, UserCredentialsFormComponent],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss',
})
export default class SignInPageComponent {
  private userStore = inject(UserStore);

  onSignIn(credentials: UserCredentials) {
    this.userStore.signIn(credentials);
  }
}
