import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { FieldErrorPipe, FieldStatusPipe } from '@app/common/pipes';
import { getFieldDescriptor as fDescriptor } from '@common/utils';
import { FORM_FIELD_EXPORTS, TextareaComponent } from '@app/common/components';

const FIELD = {
  MY_TEXTAREA: 'myTextarea',
};

@Component({
  selector: 'app-demo-textarea',
  imports: [
    ReactiveFormsModule,
    JsonPipe,
    TextareaComponent,
    ...FORM_FIELD_EXPORTS,
    FieldStatusPipe,
    FieldErrorPipe,
  ],
  templateUrl: './textarea.component.html',
})
export class TextareaDemoPageComponent {
  consoleLog = console.log;

  myForm = new FormGroup({
    [FIELD.MY_TEXTAREA]: new FormControl('', [Validators.required]),
  });

  get fMyTextarea() {
    return fDescriptor(this.myForm, FIELD.MY_TEXTAREA);
  }
}
