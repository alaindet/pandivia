import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import { QuantityInputComponent } from '@app/common/components';

const IMPORTS = [
  JsonPipe,
  ReactiveFormsModule,
  QuantityInputComponent,
];

@Component({
  selector: 'app-demo-quantity-input',
  standalone: true,
  imports: IMPORTS,
  templateUrl: './quantity-input.component.html',
})
export class QuantityInputDemoPageComponent {

  consoleLog = console.log;

  myForm = new FormGroup({
    quantity: new FormControl(null, [Validators.required]),
  });
}
