import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-form-field-hint',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  host: { class: 'app-form-field-hint' },
  template: `<ng-content></ng-content>`,
  styleUrls: ['./form-field-hint.scss'],
})
export class FormFieldHintComponent {}
