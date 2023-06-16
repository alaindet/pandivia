import { Component, HostBinding, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-form-field-error',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  host: { class: 'app-form-field-error' },
  template: `<ng-content></ng-content>`,
  styleUrls: ['./form-field-error.scss'],
})
export class FormFieldErrorComponent {
  @Input() @HostBinding('attr.id') errorId!: string;
}
