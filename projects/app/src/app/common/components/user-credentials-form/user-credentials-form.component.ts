import { AfterContentInit, Component, ViewChild, inject, input, output, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule } from '@jsverse/transloco';

import { ButtonComponent, FORM_FIELD_EXPORTS, PageHeaderComponent, TextInputComponent } from '@app/common/components';
import { FIELD_PIPES_EXPORTS } from '@app/common/pipes';
import { getFieldDescriptor as fDescribe } from '@app/common/utils';
import { UserCredentials } from '@app/features/user';
import { USER_CREDENTIALS_FIELD as FIELD } from './fields';

const imports = [
  ReactiveFormsModule,
  MatIconModule,
  TranslocoModule,
  PageHeaderComponent,
  TextInputComponent,
  ButtonComponent,
  ...FORM_FIELD_EXPORTS,
  ...FIELD_PIPES_EXPORTS,
];

@Component({
  selector: 'app-user-credentials-form',
  standalone: true,
  imports,
  templateUrl: './user-credentials-form.component.html',
  styleUrl: './user-credentials-form.component.scss',
})
export class UserCredentialsFormComponent implements AfterContentInit {

  private formBuilder = inject(FormBuilder);

  submitLabel = input.required<string>();
  email = input<string>();

  confirmed = output<UserCredentials>();

  FIELD = FIELD;
  theForm = this.formBuilder.group({
    [FIELD.EMAIL.id]: [this.email() ?? '', [Validators.required, Validators.email]],
    [FIELD.PASSWORD.id]: ['', [Validators.required]],
  });

  emailRef = viewChild.required('emailRef', { read: TextInputComponent });

  get fEmail() { return fDescribe(this.theForm, FIELD.EMAIL.id) }
  get fPassword() { return fDescribe(this.theForm, FIELD.PASSWORD.id) }

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
