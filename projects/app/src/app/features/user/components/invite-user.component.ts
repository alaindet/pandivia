import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslocoModule } from '@jsverse/transloco';
import { finalize } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';

import { UiService } from '@app/core/ui';
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
  private store = inject(Store);
  private invitesService = inject(InvitesService);
  private ui = inject(UiService);

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

    this.ui.loader.start();
    this.invitesService.createInvite(email!)
      .pipe(finalize(() => this.ui.loader.stop()))
      .subscribe({
        error: err => {
          console.error(err);
          this.ui.notification.err('inviteUser.generationError');
        },
        next: url => {
          this.ui.notification.ok('inviteUser.generationSuccess');
          this.inviteUrl = url;
          copyToClipboard(url);
        },
      });
  }
}
