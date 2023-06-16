import { Component, Input, OnChanges, ViewEncapsulation, inject } from '@angular/core';

import { FormFieldContextService } from '../../context.service';

@Component({
  selector: 'app-form-field',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  host: { class: 'app-form-field' },
  providers: [FormFieldContextService],
  templateUrl: './form-field.component.html',
  styleUrls: ['./form-field.component.scss'],
})
export class FormFieldComponent implements OnChanges {

  private context = inject(FormFieldContextService);

  @Input() id!: string;

  ngOnChanges() {
    this.context.id.set(this.id);
  }
}
