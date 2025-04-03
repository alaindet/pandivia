import { Component } from '@angular/core';
import { JsonPipe } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CheckboxComponent } from '@ui/components';
import { ButtonComponent } from '@ui/components';

@Component({
  selector: 'app-demo-checkbox',
  imports: [JsonPipe, ReactiveFormsModule, CheckboxComponent, ButtonComponent],
  templateUrl: './checkbox.component.html',
  styles: [
    `
      .demo-cases {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }
    `,
  ],
})
export class CheckboxDemoPageComponent {
  consoleLog = console.log;

  myForm = new FormGroup({
    myCheckbox1: new FormControl(true, [Validators.required]),
    myCheckbox2: new FormControl(false, [Validators.required]),
  });
}
