import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { getFieldDescriptor as fDescriptor } from '@common/utils';
import {
  FormFieldComponent,
  FormFieldErrorComponent,
  FormFieldHintComponent,
  FormFieldLabelComponent,
} from '@ui/components';
import { TextareaComponent } from '@ui/components';
import { FieldErrorPipe, FieldStatusPipe } from '@ui/pipes';

const FIELD = {
  MY_TEXTAREA: 'myTextarea',
};

@Component({
  selector: 'app-demo-textarea',
  imports: [
    ReactiveFormsModule,
    JsonPipe,
    TextareaComponent,
    FormFieldComponent,
    FormFieldErrorComponent,
    FormFieldHintComponent,
    FormFieldLabelComponent,
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
