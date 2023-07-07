import { NgIf } from '@angular/common';
import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule } from '@ngneat/transloco';

import { ButtonComponent, FORM_FIELD_EXPORTS, PageHeaderComponent, TextInputComponent } from '@app/common/components';
import { FieldErrorIdPipe, FieldErrorPipe, FieldStatusPipe } from '@app/common/pipes';
import { getFieldDescriptor as fDescribe } from '@app/common/utils';
import { Store } from '@ngrx/store';
import { userSignInActions } from '../../store';
import { UserCredentials } from '../../types';
import { SIGN_IN_FIELD as FIELD } from './fields';

const imports = [
  NgIf,
  ReactiveFormsModule,
  MatIconModule,
  TranslocoModule,
  PageHeaderComponent,
  ...FORM_FIELD_EXPORTS,
  TextInputComponent,
  FieldStatusPipe,
  FieldErrorPipe,
  FieldErrorIdPipe,
  ButtonComponent,
];

@Component({
  selector: 'app-signin-page',
  standalone: true,
  imports,
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
})
export default class SignInPageComponent implements OnInit {

  private formBuilder = inject(FormBuilder);
  private store = inject(Store);

  theForm!: FormGroup;
  FIELD = FIELD;

  @ViewChild('emailRef', { read: TextInputComponent })
  set emailRefSetter(ref: TextInputComponent) {
    this.emailRef = ref;
  }
  emailRef!: TextInputComponent;

  get fEmail() { return fDescribe(this.theForm, FIELD.EMAIL.id) }
  get fPassword() { return fDescribe(this.theForm, FIELD.PASSWORD.id) }

  ngOnInit() {
    this.initForm();
  }

  ngAfterContentInit() {
    setTimeout(() => this.emailRef.focus());
  }

  onSignIn() {
    if (this.theForm.invalid) {
      return;
    }

    const credentials: UserCredentials = this.theForm.value;
    this.store.dispatch(userSignInActions.signIn({ credentials }));
  }

  private initForm(): void {
    const { required, email } = Validators;

    this.theForm = this.formBuilder.group({
      [FIELD.EMAIL.id]: ['', [required, email]],
      [FIELD.PASSWORD.id]: ['', [required]],
    });
  }
}
