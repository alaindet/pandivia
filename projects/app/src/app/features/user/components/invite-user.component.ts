import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslocoModule } from '@jsverse/transloco';
import { finalize } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';

import { UiStoreFeatureService } from '@app/core/ui';
import { ButtonComponent, FORM_FIELD_EXPORTS, TextInputComponent } from '@app/common/components';
import { copyToClipboard, getFieldDescriptor as fDescribe } from '@app/common/utils';
import { FIELD_PIPES_EXPORTS } from '@app/common/pipes';
import { InvitesService } from '../services';

const imports = [
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
  styleUrl: './invite-user.component.scss',
})
export class InviteUserComponent {

  private formBuilder = inject(FormBuilder);
  private uiStore = inject(UiStoreFeatureService);
  private invitesService = inject(InvitesService);

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

    this.uiStore.loading.start();

    this.invitesService.createInvite(email!)
      .pipe(finalize(() => this.uiStore.loading.stop()))
      .subscribe({
        error: err => {
          console.error(err);
          this.uiStore.notifications.error('inviteUser.generationError');
        },
        next: url => {
          this.uiStore.notifications.success('inviteUser.generationSuccess');
          this.inviteUrl = url;
          copyToClipboard(url);
        },
      });
  }
}
