import { Component, HostBinding, ViewEncapsulation, input } from '@angular/core';

@Component({
  selector: 'app-form-field-error',
  standalone: true,
  template: `<ng-content></ng-content>`,
  styleUrl: './form-field-error.scss',
  host: { class: 'app-form-field-error' },
  encapsulation: ViewEncapsulation.None,
})
export class FormFieldErrorComponent {

  errorId = input('');

  @HostBinding('attr.id')
  get attrId() {
    return this.errorId();
  }
}
