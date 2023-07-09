import { Component, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslocoModule } from '@ngneat/transloco';

import { ButtonComponent, FORM_FIELD_EXPORTS, TextInputComponent } from '@app/common/components';
import { getFieldDescriptor as fDescribe } from '@app/common/utils';
import { FIELD_PIPES_EXPORTS } from '@app/common/pipes';

const imports = [
  NgIf,
  ReactiveFormsModule,
  TranslocoModule,
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

    /**
     * 1. Generate a invitation consisting of a document in the "invites"
     * collection
     * 2. The invite contains
     *    - id or hash (hard to guess)
     *    - email
     *    - createdAt
     *    - expiresAt
     * 3. Generate a link similar to this
     *    - 'https://myapp.com/signup?invite=hsjkdhakjshdkjasd'
     * 4. Check
     *    - Existing invites with that hash
     *    - Expiration
     *    - Matching email on sign up
     * 5. Remove token after sign up
     */

    const { protocol, host } = window.location;
    const token = 'TOKEN_HASH_HERE'; // TODO
    const baseUrl = `${protocol}//${host}`;
    this.inviteUrl = `${baseUrl}/signup?inviteToken=${token}`;

    // TODO: Automatically copy to clipboard!
    // https://material.angular.io/cdk/clipboard/overview
  }
}
