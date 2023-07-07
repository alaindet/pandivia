import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule } from '@ngneat/transloco';

import { DEFAULT_ROUTE } from '@app/app.routes';
import { ButtonComponent, FORM_FIELD_EXPORTS, PageHeaderComponent, TextInputComponent } from '@app/common/components';
import { FieldErrorIdPipe, FieldErrorPipe, FieldStatusPipe } from '@app/common/pipes';
import { getFieldDescriptor as fDescribe } from '@app/common/utils';
import { UserCredentials } from '../../types';
import { SIGN_IN_FIELD as FIELD } from './fields';
import { AuthenticationService } from '../../services';
import { NotificationService } from '@app/core';

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
  private router = inject(Router);
  private notification = inject(NotificationService);
  private auth = inject(AuthenticationService);

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

    this.auth.signIn(credentials).subscribe({
      error: err => {
        this.notification.error('auth.signInError');
      },
      next: () => {
        this.router.navigate([DEFAULT_ROUTE]);
        this.notification.success('auth.signInSuccess');
      },
    });
  }

  private initForm(): void {
    const { required, email } = Validators;

    this.theForm = this.formBuilder.group({
      [FIELD.EMAIL.id]: ['', [required, email]],
      [FIELD.PASSWORD.id]: ['', [required]],
    });
  }
}
