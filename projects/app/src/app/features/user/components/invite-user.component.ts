import { Component, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslocoModule } from '@ngneat/transloco';
import { Store } from '@ngrx/store';
import { finalize } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';

import { NotificationService, uiLoaderActions } from '@app/core';
import { ButtonComponent, FORM_FIELD_EXPORTS, TextInputComponent } from '@app/common/components';
import { copyToClipboard, getFieldDescriptor as fDescribe } from '@app/common/utils';
import { FIELD_PIPES_EXPORTS } from '@app/common/pipes';
import { InvitesService } from '../services';

const imports = [
  NgIf,
  ReactiveFormsModule,
  TranslocoModule,
  MatIconModule,
  TextInputComponent,
  ButtonComponent,
  ...FORM_FIELD_EXPORTS,
  ...FIELD_PIPES_EXPORTS,
];

@Component({
  selector: 'app-invite-user',
  standalone: true,
  imports,
  templateUrl: './invite-user.component.html',
  styleUrls: ['./invite-user.component.scss'],
})
export class InviteUserComponent {

  private formBuilder = inject(FormBuilder);
  private store = inject(Store);
  private invitesService = inject(InvitesService);
  private notification = inject(NotificationService);

  inviteUrl: string | null = null;
  theForm = this.formBuilder.group({
    email: ['', [Validators.email]],
  });

  get fEmail() { return fDescribe(this.theForm, 'email') }

  onGenerateLink() {

    if (this.theForm.invalid) {
      return;
    }

    const { email } = this.theForm.value;

    this.store.dispatch(uiLoaderActions.start());
    this.invitesService.createInvite(email!)
      .pipe(finalize(() => this.store.dispatch(uiLoaderActions.stop())))
      .subscribe({
        error: err => {
          console.error(err);
          this.notification.error('inviteUser.generationError');
        },
        next: url => {
          this.notification.success('inviteUser.generationSuccess');
          this.inviteUrl = url;
          copyToClipboard(url);
        },
      });
  }
}
