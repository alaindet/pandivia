import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { finalize } from 'rxjs';
import { Store } from '@ngrx/store';
import { TranslocoModule } from '@ngneat/transloco';
import { MatIconModule } from '@angular/material/icon';

import { NotificationService, uiLoaderActions } from '@app/core';
import { FIELD_PIPES_EXPORTS } from '@app/common/pipes';
import { ButtonComponent, FORM_FIELD_EXPORTS, PageHeaderComponent, TextInputComponent } from '@app/common/components';
import { getFieldDescriptor as fDescribe } from '@app/common/utils';
import { InvitesService } from '../../services';
import { SignUpUserDto, UserInvite } from '../../types';
import { SIGNUP_FIELD as FIELD } from './fields';
import { DEFAULT_ROUTE } from '@app/app.routes';

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
  styleUrls: ['./signup.component.scss'],
})
export default class SignUpPageComponent implements OnInit {

  private formBuilder = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private store = inject(Store);
  private notification = inject(NotificationService);
  private invitesService = inject(InvitesService);

  private inviteId = this.route.snapshot.queryParams['invite'];
  invite?: UserInvite;
  theForm!: FormGroup;
  FIELD = FIELD;

  @ViewChild('emailRef', { read: TextInputComponent })
  set emailRefSetter(ref: TextInputComponent) {
    this.emailRef = ref;
  }
  emailRef!: TextInputComponent;

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

    this.store.dispatch(uiLoaderActions.start());
    this.invitesService.findInvite(this.inviteId)
      .pipe(finalize(() => this.store.dispatch(uiLoaderActions.stop())))
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
      this.notification.error('inviteUser.emailMustMatchInvite', { email });
      return;
    }

    this.store.dispatch(uiLoaderActions.start());
    this.invitesService.signUpUser(this.inviteId, dto)
      .pipe(finalize(() => this.store.dispatch(uiLoaderActions.stop())))
      .subscribe({
        error: err => {
          console.error(err);
          this.notification.error('auth.signUpError');
        },
        next: () => {
          this.notification.success('auth.signUpSuccess');
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
    this.notification.error('inviteUser.invalidInvite');
  }
}
