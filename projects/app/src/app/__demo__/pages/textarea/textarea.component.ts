import { JsonPipe, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { FieldStatusPipe } from '@app/common/pipes';
import { FORM_FIELD_EXPORTS, TextareaComponent } from '@app/common/components';

const imports = [
  NgIf,
  ReactiveFormsModule,
  JsonPipe,
  TextareaComponent,
  ...FORM_FIELD_EXPORTS,
  FieldStatusPipe,
];

@Component({
  selector: 'app-demo-textarea',
  standalone: true,
  imports,
  templateUrl: './textarea.component.html',
})
export class TextareaDemoPageComponent {

  consoleLog = console.log;

  myForm = new FormGroup({
    myTextarea: new FormControl('', [Validators.required]),
  });

  get fMyTextarea(): FormControl {
    return this.myForm.get('myTextarea')! as FormControl;
  }
}
