import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-form-field-hint',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  host: { class: 'app-form-field-hint' },
  template: `<ng-content></ng-content>`,
  styles: [`  
    @import 'scoped';

    .app-form-field-hint {
      display: block;
      color: $app-color-beige-800;
      font-size: 0.75rem;
      letter-spacing: 0.08px;
      font-style: italic;
    }
  `],
})
export class FormFieldHintComponent {}
