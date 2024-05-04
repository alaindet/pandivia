import { Component } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ButtonComponent, CheckboxComponent } from '@app/common/components';

const imports = [
  JsonPipe,
  ReactiveFormsModule,
  CheckboxComponent,
  ButtonComponent,
];

@Component({
  selector: 'app-demo-checkbox',
  standalone: true,
  imports,
  templateUrl: './checkbox.component.html',
  styles: [`
    .demo-cases {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
  `],
})
export class CheckboxDemoPageComponent {

  consoleLog = console.log;

  myForm = new FormGroup({
    myCheckbox1: new FormControl(true, [Validators.required]),
    myCheckbox2: new FormControl(false, [Validators.required]),
  });
}
