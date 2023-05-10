import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-form-field-hint',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  template: `<ng-content></ng-content>`,
  styleUrls: ['./form-field-hint.component.scss'],
  host: { class: 'app-form-field-hint' },
})
export class FormFieldHintComponent {}
