import { AsyncPipe, NgIf } from '@angular/common';
import { Component, Input, ViewEncapsulation, inject } from '@angular/core';

import { FormFieldContextService } from '../../context.service';
import { asBoolean } from '@app/common/utils';

const imports = [
  NgIf,
  AsyncPipe,
];

@Component({
  selector: 'app-form-field-label',
  standalone: true,
  imports,
  encapsulation: ViewEncapsulation.None,
  host: { class: 'app-form-field-label' },
  templateUrl: './form-field-label.component.html',
  styleUrls: ['./form-field-label.scss'],
})
export class FormFieldLabelComponent {

  context = inject(FormFieldContextService);

  @Input('isRequired')
  set isRequiredInput(val: boolean | string) {
    this.isRequired = asBoolean(val);
  }

  isRequired = false;
}
