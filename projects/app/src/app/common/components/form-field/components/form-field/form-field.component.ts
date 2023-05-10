import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-form-field',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  template: `<ng-content></ng-content>`,
  styleUrls: ['./form-field.component.scss'],
  host: { class: 'app-form-field' },
})
export class FormFieldComponent {}
