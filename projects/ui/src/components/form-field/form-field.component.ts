import { Component, ViewEncapsulation, input } from '@angular/core';

@Component({
  selector: 'app-form-field',
  templateUrl: './form-field.component.html',
  styleUrl: './form-field.component.css',
  host: { class: 'app-form-field' },
  encapsulation: ViewEncapsulation.None,
})
export class FormFieldComponent {
  id = input<string>('');
}
