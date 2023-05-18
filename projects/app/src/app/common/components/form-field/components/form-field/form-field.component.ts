import { Component, Input, OnChanges, ViewEncapsulation, inject } from '@angular/core';

import { FormFieldContextService } from '../../context.service';

@Component({
  selector: 'app-form-field',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  host: { class: 'app-form-field' },
  providers: [FormFieldContextService],
  template: `
    <ng-content></ng-content>
    <div class="_messages">
      <ng-content select="app-form-field-hint"></ng-content>
      <ng-content select="app-form-field-error"></ng-content>
    </div>
  `,
  styles: [`
    .app-form-field {
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      ._messages:not(:empty) {
        display: flex;
        flex-direction: column;
        gap: 0.33rem;
        margin-top: 0.5rem;
      }
    }
  `],
})
export class FormFieldComponent implements OnChanges {

  private context = inject(FormFieldContextService);

  @Input() id!: string;

  ngOnChanges() {
    this.context.id.set(this.id);
  }
}
