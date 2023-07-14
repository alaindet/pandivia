import { Component, inject } from '@angular/core';
import { TranslocoModule } from '@ngneat/transloco';
import { Store } from '@ngrx/store';

import { PageHeaderComponent, UserCredentialsFormComponent } from '@app/common/components';
import { userSignIn } from '../../store';
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
    this.store.dispatch(userSignIn.try({ credentials }));
  }
}
