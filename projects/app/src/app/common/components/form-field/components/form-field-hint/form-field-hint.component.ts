import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-form-field-hint',
  standalone: true,
  template: `<ng-content></ng-content>`,
  styleUrl: './form-field-hint.scss',
  host: { class: 'app-form-field-hint' },
  encapsulation: ViewEncapsulation.None,
})
export class FormFieldHintComponent {}
