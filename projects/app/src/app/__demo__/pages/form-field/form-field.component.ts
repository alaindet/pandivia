import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  FormFieldComponent,
  FormFieldErrorComponent,
  FormFieldHintComponent,
  FormFieldLabelComponent,
} from '@ui/components';
import { TextInputComponent } from '@ui/components';

@Component({
  selector: 'app-demo-form-field',
  imports: [
    FormFieldComponent,
    FormFieldErrorComponent,
    FormFieldHintComponent,
    FormFieldLabelComponent,
    ReactiveFormsModule,
    TextInputComponent,
  ],
  templateUrl: './form-field.component.html',
  styles: [
    `
      :host > h2 {
        margin-top: 3rem;
      }

      :host > h2:first-of-type {
        margin-top: 0;
      }
    `,
  ],
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
