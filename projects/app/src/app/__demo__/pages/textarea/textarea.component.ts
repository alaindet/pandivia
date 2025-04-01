import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FieldErrorPipe, FieldStatusPipe } from '@ui/pipes';
import { getFieldDescriptor as fDescriptor } from '@fixcommon/utils';
import { TextareaComponent } from '@ui/components/textarea';
import { FORM_FIELD_EXPORTS } from '@ui/components/form-field';

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
