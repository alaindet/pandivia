import { JsonPipe, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ButtonComponent, TextInputComponent } from '@app/common/components';

const IMPORTS = [
  NgIf,
  ReactiveFormsModule,
  JsonPipe,
  TextInputComponent,
];

@Component({
  selector: 'app-demo-text-input',
  standalone: true,
  imports: IMPORTS,
  templateUrl: './text-input.component.html',
})
export class TextInputDemoPageComponent {

  consoleLog = console.log;

  myForm = new FormGroup({
    myTextInput: new FormControl('', [Validators.required]),
  });

  get fMyTextInput(): FormControl {
    return this.myForm.get('myTextInput')! as FormControl;
  }
}
