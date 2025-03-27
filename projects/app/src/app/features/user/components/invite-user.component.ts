import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslocoModule } from '@jsverse/transloco';
import { finalize } from 'rxjs';
import { NgIcon } from '@ng-icons/core';
import { matPersonAdd } from '@ng-icons/material-icons/baseline';

import { UiStore } from '@app/core/ui';
import {
  ButtonComponent,
  FORM_FIELD_EXPORTS,
  TextInputComponent,
} from '@app/common/components';
import {
  copyToClipboard,
  getFieldDescriptor as fDescribe,
} from '@app/common/utils';
import { FIELD_PIPES_EXPORTS } from '@app/common/pipes';
import { InvitesService } from '../services';

@Component({
  selector: 'app-invite-user',
  imports: [
    ReactiveFormsModule,
    TranslocoModule,
    NgIcon,
    TextInputComponent,
    ButtonComponent,
    ...FORM_FIELD_EXPORTS,
    ...FIELD_PIPES_EXPORTS,
  ],
  templateUrl: './invite-user.component.html',
  styleUrl: './invite-user.component.css',
})
export class InviteUserComponent {
  private formBuilder = inject(FormBuilder);
  private uiStore = inject(UiStore);
  private invitesService = inject(InvitesService);

  inviteUrl: string | null = null;
  matPersonAdd = matPersonAdd;
  theForm = this.formBuilder.group({
    email: ['', [Validators.email]],
  });

  get fEmail() {
    return fDescribe(this.theForm, 'email');
  }

  onGenerateLink() {
    if (this.theForm.invalid) {
      return;
    }

    const { email } = this.theForm.value;

    this.uiStore.loader.start();

    this.invitesService
      .createInvite(email!)
      .pipe(finalize(() => this.uiStore.loader.stop()))
      .subscribe({
        error: (err) => {
          console.error(err);
          this.uiStore.notifications.error('inviteUser.generationError');
        },
        next: (url) => {
          this.uiStore.notifications.success('inviteUser.generationSuccess');
          this.inviteUrl = url;
          copyToClipboard(url);
        },
      });
  }
}
