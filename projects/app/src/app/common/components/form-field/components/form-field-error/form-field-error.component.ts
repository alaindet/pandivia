import { Component, HostBinding, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-form-field-error',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  host: { class: 'app-form-field-error' },
  template: `<ng-content></ng-content>`,
  styles: [`
    @import 'scoped';

    .app-form-field-error {
      display: block;
      color: $app-color-error;
      font-size: 0.75rem;
      letter-spacing: 0.08px;
    }
  `],
})
export class FormFieldErrorComponent {
  @Input() @HostBinding('attr.id') errorId!: string;
}
