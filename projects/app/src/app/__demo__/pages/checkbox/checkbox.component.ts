import { CommonModule, JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { CheckboxComponent } from '@app/common/components/checkbox';

const IMPORTS = [
  CommonModule,
  ReactiveFormsModule,
  CheckboxComponent,
  JsonPipe,
];

@Component({
  selector: 'app-demo-checkbox',
  standalone: true,
  imports: IMPORTS,
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
  myForm = new FormGroup({
    myCheckbox1: new FormControl(true, [Validators.required]),
    myCheckbox2: new FormControl(false, [Validators.required]),
  })
}
