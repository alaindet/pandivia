import { Component, inject } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';

import { PageHeaderComponent, UserCredentialsFormComponent } from '@app/common/components';
import { UserStore } from '../../store';
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
  styleUrl: './signin.component.scss',
})
export default class SignInPageComponent {

  private userStore = inject(UserStore);

  onSignIn(credentials: UserCredentials) {
    this.userStore.signIn(credentials);
  }
}
