import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-form-field-error',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  template: `<ng-content></ng-content>`,
  styleUrls: ['./form-field-error.component.scss'],
  host: { class: 'app-form-field-error' },
})
export class FormFieldErrorComponent {}
