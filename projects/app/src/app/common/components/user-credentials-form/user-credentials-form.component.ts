import {
  AfterContentInit,
  Component,
  inject,
  input,
  output,
  viewChild,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIcon } from '@ng-icons/core';
import { matLogin } from '@ng-icons/material-icons/baseline';
import { TranslocoModule } from '@jsverse/transloco';

import {
  ButtonComponent,
  FORM_FIELD_EXPORTS,
  TextInputComponent,
} from '@app/common/components';
import { FIELD_PIPES_EXPORTS } from '@app/common/pipes';
import { getFieldDescriptor as fDescribe } from '@common/utils';
import { UserCredentials } from '@app/features/user';
import { USER_CREDENTIALS_FIELD as FIELD } from './fields';

@Component({
  selector: 'app-user-credentials-form',
  imports: [
    ReactiveFormsModule,
    NgIcon,
    TranslocoModule,
    TextInputComponent,
    ButtonComponent,
    ...FORM_FIELD_EXPORTS,
    ...FIELD_PIPES_EXPORTS,
  ],
  templateUrl: './user-credentials-form.component.html',
  styleUrl: './user-credentials-form.component.css',
})
export class UserCredentialsFormComponent implements AfterContentInit {
  private formBuilder = inject(FormBuilder);

  submitLabel = input.required<string>();
  email = input<string>();

  confirmed = output<UserCredentials>();

  emailRef = viewChild.required('emailRef', { read: TextInputComponent });

  matLogin = matLogin;
  FIELD = FIELD;
  theForm = this.formBuilder.group({
    [FIELD.EMAIL.id]: [
      this.email() ?? '',
      [Validators.required, Validators.email],
    ],
    [FIELD.PASSWORD.id]: ['', [Validators.required]],
  });

  get fEmail() {
    return fDescribe(this.theForm, FIELD.EMAIL.id);
  }
  get fPassword() {
    return fDescribe(this.theForm, FIELD.PASSWORD.id);
  }

  ngAfterContentInit() {
    setTimeout(() => this.emailRef().focus());
  }

  onSignIn() {
    if (this.theForm.invalid) {
      return;
    }

    const credentials = this.theForm.value as UserCredentials;
    this.confirmed.emit(credentials);
  }
}
