import {
  Component,
  ViewEncapsulation,
  computed,
  inject,
  input,
} from '@angular/core';

import { asBoolean } from '@app/common/utils';
import { FormFieldContextService } from '../../context.service';

@Component({
  selector: 'app-form-field-label',
  encapsulation: ViewEncapsulation.None,
  host: { class: 'app-form-field-label' },
  templateUrl: './form-field-label.component.html',
  styleUrl: './form-field-label.component.css',
})
export class FormFieldLabelComponent {
  context = inject(FormFieldContextService);

  _isRequired = input<boolean | string>(false, { alias: 'isRequired' });
  isRequired = computed(() => asBoolean(this._isRequired()));

  _isOptional = input<boolean | string>(false, { alias: 'isOptional' });
  isOptional = computed(() => asBoolean(this._isOptional()));
}
