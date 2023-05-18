import { AsyncPipe, NgIf } from '@angular/common';
import { Component, Input, ViewEncapsulation, inject } from '@angular/core';

import { FormFieldContextService } from '../../context.service';

const IMPORTS = [
  NgIf,
  AsyncPipe,
];

@Component({
  selector: 'app-form-field-label',
  standalone: true,
  imports: IMPORTS,
  encapsulation: ViewEncapsulation.None,
  host: { class: 'app-form-field-label' },
  template: `
    <label [attr.for]="context.id()"
      ><ng-content></ng-content
      ><ng-container *ngIf="isRequired">*</ng-container>
    </label>
  `,
  styles: [`
    @import 'scoped';

    .app-form-field-label {
      label {
        display: inline-block;
        color: $app-color-black;
        margin-bottom: 0.5rem;
        font-weight: bold;
      }
    }
  `],
})
export class FormFieldLabelComponent {

  context = inject(FormFieldContextService);

  @Input() isRequired = false;
}
