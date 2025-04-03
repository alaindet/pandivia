import { Component, OnInit, inject, viewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { getFieldDescriptor as fDescribe } from '@common/utils';
import { ButtonComponent } from '@ui/components';
import {
  FormFieldComponent,
  FormFieldErrorComponent,
  FormFieldLabelComponent,
} from '@ui/components';
import { PageHeaderComponent } from '@ui/components';
import { TextInputComponent } from '@ui/components';
import { FieldErrorIdPipe, FieldErrorPipe, FieldStatusPipe } from '@ui/pipes';
import { TranslocoModule } from '@jsverse/transloco';
import { NgIcon } from '@ng-icons/core';
import { matPerson } from '@ng-icons/material-icons/baseline';
import { finalize } from 'rxjs';

import { DEFAULT_ROUTE } from '@app/app.routes';
import { UiStore } from '@app/core/ui';
import { InvitesService } from '../../services';
import { SignUpUserDto, UserInvite } from '../../types';
import { SIGNUP_FIELD as FIELD } from './fields';

@Component({
  selector: 'app-signup-page',
  imports: [
    ReactiveFormsModule,
    TranslocoModule,
    PageHeaderComponent,
    NgIcon,
    TextInputComponent,
    ButtonComponent,
    FieldErrorPipe,
    FieldErrorIdPipe,
    FieldStatusPipe,
    FormFieldComponent,
    FormFieldErrorComponent,
    FormFieldLabelComponent,
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export default class SignUpPageComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private uiStore = inject(UiStore);
  private invitesService = inject(InvitesService);

  emailRef = viewChild.required('emailRef', { read: TextInputComponent });

  private inviteId = this.route.snapshot.queryParams['invite'];
  invite?: UserInvite;
  theForm!: FormGroup;
  FIELD = FIELD;
  matPerson = matPerson;

  get fName() {
    return fDescribe(this.theForm, FIELD.NAME.id);
  }
  get fEmail() {
    return fDescribe(this.theForm, FIELD.EMAIL.id);
  }
  get fPassword() {
    return fDescribe(this.theForm, FIELD.PASSWORD.id);
  }

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

    this.uiStore.loader.start();
    this.invitesService
      .findInvite(this.inviteId)
      .pipe(finalize(() => this.uiStore.loader.stop()))
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
      this.uiStore.notifications.error('inviteUser.emailMustMatchInvite', {
        email,
      });
      return;
    }

    this.uiStore.loader.start();
    this.invitesService
      .signUpUser(this.inviteId, dto)
      .pipe(finalize(() => this.uiStore.loader.stop()))
      .subscribe({
        error: (err) => {
          console.error(err);
          this.uiStore.notifications.error('auth.signUpError');
        },
        next: () => {
          this.uiStore.notifications.success('auth.signUpSuccess');
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
    this.uiStore.notifications.error('inviteUser.invalidInvite');
  }
}
