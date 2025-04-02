import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  copyToClipboard,
  getFieldDescriptor as fDescribe,
} from '@common/utils';
import { ButtonComponent } from '@fruit/components/button';
import {
  FormFieldComponent,
  FormFieldErrorComponent,
} from '@fruit/components/form-field';
import { TextInputComponent } from '@fruit/components/text-input';
import {
  FieldErrorIdPipe,
  FieldErrorPipe,
  FieldStatusPipe,
} from '@fruit/pipes';
import { TranslocoModule } from '@jsverse/transloco';
import { NgIcon } from '@ng-icons/core';
import { matPersonAdd } from '@ng-icons/material-icons/baseline';
import { finalize } from 'rxjs';

import { UiStore } from '@app/core/ui';
import { InvitesService } from '../services';

@Component({
  selector: 'app-invite-user',
  imports: [
    ReactiveFormsModule,
    TranslocoModule,
    NgIcon,
    TextInputComponent,
    ButtonComponent,
    FieldErrorPipe,
    FieldErrorIdPipe,
    FieldStatusPipe,
    FormFieldComponent,
    FormFieldErrorComponent,
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
    email: ['', [Validators.required, Validators.email]],
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
