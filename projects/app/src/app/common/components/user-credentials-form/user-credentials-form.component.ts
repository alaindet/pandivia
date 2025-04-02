import {
  AfterContentInit,
  Component,
  inject,
  input,
  output,
  viewChild,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { getFieldDescriptor as fDescribe } from '@common/utils';
import { ButtonComponent } from '@fruit/components/button';
import {
  FormFieldComponent,
  FormFieldErrorComponent,
  FormFieldLabelComponent,
} from '@fruit/components/form-field';
import { TextInputComponent } from '@fruit/components/text-input';
import {
  FieldErrorIdPipe,
  FieldErrorPipe,
  FieldStatusPipe,
} from '@fruit/pipes';
import { TranslocoModule } from '@jsverse/transloco';
import { NgIcon } from '@ng-icons/core';
import { matLogin } from '@ng-icons/material-icons/baseline';

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
    FieldErrorPipe,
    FieldErrorIdPipe,
    FieldStatusPipe,
    FormFieldComponent,
    FormFieldErrorComponent,
    FormFieldLabelComponent,
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
