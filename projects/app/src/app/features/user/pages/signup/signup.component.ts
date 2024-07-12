import { NgIf } from '@angular/common';
import { Component, OnInit, ViewChild, inject, viewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { Store } from '@ngrx/store';
import { finalize } from 'rxjs';

import { DEFAULT_ROUTE } from '@app/app.routes';
import { ButtonComponent, FORM_FIELD_EXPORTS, PageHeaderComponent, TextInputComponent } from '@app/common/components';
import { FIELD_PIPES_EXPORTS } from '@app/common/pipes';
import { getFieldDescriptor as fDescribe } from '@app/common/utils';
import { UiService } from '@app/core/ui';
import { InvitesService } from '../../services';
import { SignUpUserDto, UserInvite } from '../../types';
import { SIGNUP_FIELD as FIELD } from './fields';

const imports = [
  NgIf,
  ReactiveFormsModule,
  TranslocoModule,
  PageHeaderComponent,
  MatIconModule,
  TextInputComponent,
  ButtonComponent,
  ...FORM_FIELD_EXPORTS,
  ...FIELD_PIPES_EXPORTS,
];

@Component({
  selector: 'app-signup-page',
  standalone: true,
  imports,
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export default class SignUpPageComponent implements OnInit {

  private formBuilder = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private ui = inject(UiService);
  private invitesService = inject(InvitesService);

  private inviteId = this.route.snapshot.queryParams['invite'];
  invite?: UserInvite;
  theForm!: FormGroup;
  FIELD = FIELD;

  emailRef = viewChild.required('emailRef', { read: TextInputComponent });

  get fName() { return fDescribe(this.theForm, FIELD.NAME.id) }
  get fEmail() { return fDescribe(this.theForm, FIELD.EMAIL.id) }
  get fPassword() { return fDescribe(this.theForm, FIELD.PASSWORD.id) }

  ngOnInit() {

    // Is there an invite ID at all?
    if (!this.inviteId) {
      return this.invalidInvite();
    }

    const onError = (err: any) => {
      console.error(err);
      this.invalidInvite();
    };

    const onSuccess = (invite: UserInvite | null) => {

      // Does invite exist on Firebase?
      if (invite === null) {
        return this.invalidInvite();
      }

      // Is the invitation expired?
      if (invite.expiresAt < Date.now()) {
        return this.invalidInvite();
      }

      this.invite = invite;
      this.initForm();
    };

    this.ui.loader.start();
    this.invitesService.findInvite(this.inviteId)
      .pipe(finalize(() => this.ui.loader.stop()))
      .subscribe({ error: onError, next: onSuccess });
  }

  onSignUp() {

    if (this.theForm.invalid) {
      return;
    }

    const { email, password, name: displayName } = this.theForm.value;
    const dto: SignUpUserDto = { displayName, email, password };

    if (this.invite!.email !== dto.email) {
      const email = this.invite!.email;
      this.ui.notification.err('inviteUser.emailMustMatchInvite', { email });
      return;
    }

    this.ui.loader.start();
    this.invitesService.signUpUser(this.inviteId, dto)
      .pipe(finalize(() => this.ui.loader.stop()))
      .subscribe({
        error: err => {
          console.error(err);
          this.ui.notification.err('auth.signUpError');
        },
        next: () => {
          this.ui.notification.ok('auth.signUpSuccess');
          this.router.navigate([DEFAULT_ROUTE]);
        },
      });
  }

  private initForm(): void {
    const { required, email, minLength, maxLength } = Validators;

    this.theForm = this.formBuilder.group({
      [FIELD.NAME.id]: ['', [required, minLength(2), maxLength(100)]],
      [FIELD.EMAIL.id]: [this.invite!.email, [required, email]],
      [FIELD.PASSWORD.id]: ['', [required]],
    });
  }

  private invalidInvite(): void {
    this.router.navigate(['/signin']);
    this.ui.notification.err('inviteUser.invalidInvite');
  }
}
