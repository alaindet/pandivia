import { NgIf } from '@angular/common';
import { Component, Input, ViewEncapsulation } from '@angular/core';

const IMPORTS = [
  NgIf,
];

@Component({
  selector: 'app-form-field-label',
  standalone: true,
  imports: IMPORTS,
  encapsulation: ViewEncapsulation.None,
  template: `
    <label [attr.for]="id"
      ><ng-content></ng-content
      ><ng-container *ngIf="isRequired">*</ng-container>
    </label>
  `,
  styleUrls: ['./form-field-label.component.scss'],
  host: { class: 'app-form-field-label' },
})
export class FormFieldLabelComponent {
  @Input() id!: string;
  @Input() isRequired = false;
}
