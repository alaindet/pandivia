import { Component, ViewEncapsulation, effect, inject, input } from '@angular/core';

import { FormFieldContextService } from '../../context.service';

@Component({
  selector: 'app-form-field',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  host: { class: 'app-form-field' },
  providers: [FormFieldContextService],
  templateUrl: './form-field.component.html',
  styleUrl: './form-field.component.scss',
})
export class FormFieldComponent {

  private context = inject(FormFieldContextService);

  id = input<string>('');

  onIdChange$ = effect(() => {
    this.context.id.set(this.id());
  }, { allowSignalWrites: true });
}
