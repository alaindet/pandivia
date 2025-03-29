export * from './form-field.component';
export * from './form-field-error/form-field-error.component';
export * from './form-field-hint/form-field-hint.component';
export * from './form-field-label/form-field-label.component';

import { FormFieldComponent } from './form-field.component';
import { FormFieldErrorComponent } from './form-field-error/form-field-error.component';
import { FormFieldHintComponent } from './form-field-hint/form-field-hint.component';
import { FormFieldLabelComponent } from './form-field-label/form-field-label.component';

export const FORM_FIELD_EXPORTS = [
  FormFieldComponent,
  FormFieldErrorComponent,
  FormFieldHintComponent,
  FormFieldLabelComponent,
];
