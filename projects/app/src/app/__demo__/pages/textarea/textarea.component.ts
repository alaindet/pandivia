import { JsonPipe, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { FORM_FIELD_EXPORTS, TextareaComponent } from '@app/common/components';

const IMPORTS = [
  NgIf,
  ReactiveFormsModule,
  JsonPipe,
  TextareaComponent,
  ...FORM_FIELD_EXPORTS,
];

@Component({
  selector: 'app-demo-textarea',
  standalone: true,
  imports: IMPORTS,
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
