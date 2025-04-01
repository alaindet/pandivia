import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { TextInputComponent } from '@fruit/components/text-input';

@Component({
  selector: 'app-demo-text-input',
  imports: [ReactiveFormsModule, JsonPipe, TextInputComponent],
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
