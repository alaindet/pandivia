import {
  Component,
  ViewEncapsulation,
  effect,
  inject,
  input,
} from '@angular/core';

import { FormFieldContextService } from '../../context.service';

@Component({
  selector: 'app-form-field',
  templateUrl: './form-field.component.html',
  styleUrl: './form-field.component.scss',
  host: { class: 'app-form-field' },
  encapsulation: ViewEncapsulation.None,
  providers: [FormFieldContextService],
})
export class FormFieldComponent {
  private context = inject(FormFieldContextService);

  id = input<string>('');

  idEffect = effect(() => this.context.id.set(this.id()), {
    allowSignalWrites: true,
  });
}
