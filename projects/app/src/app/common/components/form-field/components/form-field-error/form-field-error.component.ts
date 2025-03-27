import {
  Component,
  HostBinding,
  ViewEncapsulation,
  input,
} from '@angular/core';

@Component({
  selector: 'app-form-field-error',
  template: `<ng-content></ng-content>`,
  styleUrl: './form-field-error.component.css',
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
