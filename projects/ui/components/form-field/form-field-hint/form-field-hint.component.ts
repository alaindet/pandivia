import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-form-field-hint',
  template: `<ng-content />`,
  styleUrl: './form-field-hint.component.css',
  host: { class: 'app-form-field-hint' },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormFieldHintComponent {}
