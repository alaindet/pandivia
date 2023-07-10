import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule } from '@ngneat/transloco';

import { ButtonComponent, FORM_FIELD_EXPORTS, PageHeaderComponent, TextInputComponent } from '@app/common/components';
import { FIELD_PIPES_EXPORTS } from '@app/common/pipes';
import { getFieldDescriptor as fDescribe } from '@app/common/utils';
import { UserCredentials } from '@app/features/user';
import { USER_CREDENTIALS_FIELD as FIELD } from './fields';

const imports = [
  NgIf,
  ReactiveFormsModule,
  MatIconModule,
  TranslocoModule,
  PageHeaderComponent,
  TextInputComponent,
  ButtonComponent,
  ...FORM_FIELD_EXPORTS,
  ...FIELD_PIPES_EXPORTS,
];

@Component({
  selector: 'app-user-credentials-form',
  standalone: true,
  imports,
  templateUrl: './user-credentials-form.component.html',
  styleUrls: ['./user-credentials-form.component.scss'],
})
export class UserCredentialsFormComponent implements OnInit {

  private formBuilder = inject(FormBuilder);

  @Input() submitLabel!: string;
  @Input() email?: string;
  @Output() confirmed = new EventEmitter<UserCredentials>();

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
    this.confirmed.emit(credentials);
  }

  private initForm(): void {
    const { required, email } = Validators;

    this.theForm = this.formBuilder.group({
      [FIELD.EMAIL.id]: [this.email ?? '', [required, email]],
      [FIELD.PASSWORD.id]: ['', [required]],
    });
  }
}
