import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { TextInputComponent } from '@app/common/components';
import { FORM_FIELD_EXPORTS } from '@app/common/components/form-field';

const imports = [
  NgIf,
  ...FORM_FIELD_EXPORTS,
  ReactiveFormsModule,
  TextInputComponent,
];

@Component({
  selector: 'app-demo-form-field',
  standalone: true,
  imports,
  templateUrl: './form-field.component.html',
  styles: [`
    :host > h2 {
      &:first-of-type { margin-top: 0 }
      margin-top: 3rem;
    }
  `],
})
export class FormFieldDemoPageComponent {

  myForm = new FormGroup({
    firstName: new FormControl(null, [
      Validators.required,
      Validators.minLength(3),
    ]),
  });

  get fFirstName(): FormControl {
    return this.myForm.get('firstName')! as FormControl;
  }
}
