export * from './field-error-id.pipe';
export * from './field-error.pipe';
export * from './field-status.pipe';

import { FieldErrorPipe } from './field-error.pipe';
import { FieldErrorIdPipe } from './field-error-id.pipe';
import { FieldStatusPipe } from './field-status.pipe';

export const FIELD_PIPES_EXPORTS = [
  FieldErrorPipe,
  FieldErrorIdPipe,
  FieldStatusPipe,
];
