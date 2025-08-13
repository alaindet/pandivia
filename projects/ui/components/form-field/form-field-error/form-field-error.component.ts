import {
  Component,
  ViewEncapsulation,
  input
} from '@angular/core';

@Component({
  selector: 'app-form-field-error',
  template: `<ng-content></ng-content>`,
  styleUrl: './form-field-error.component.css',
  host: {
    class: 'app-form-field-error',
    '[attr.id]': 'errorId()',
  },
  encapsulation: ViewEncapsulation.None,
})
export class FormFieldErrorComponent {
  errorId = input('');
}
