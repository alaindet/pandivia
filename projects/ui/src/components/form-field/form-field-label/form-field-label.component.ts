import {
  Component,
  ViewEncapsulation,
  booleanAttribute,
  inject,
  input,
} from '@angular/core';
import { FormFieldComponent } from '../form-field.component';

@Component({
  selector: 'app-form-field-label',
  encapsulation: ViewEncapsulation.None,
  host: { class: 'app-form-field-label' },
  templateUrl: './form-field-label.component.html',
  styleUrl: './form-field-label.component.css',
})
export class FormFieldLabelComponent {
  formField = inject(FormFieldComponent);

  isRequired = input(false, { transform: booleanAttribute });
  isOptional = input(false, { transform: booleanAttribute });
}
