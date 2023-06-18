import { ObjectValues } from './object-values';

export const FORM_FIELD_STATUS = {
  ERROR: 'error',
  SUCCESS: 'success',
  NONE: 'none',
} as const;

export type FormFieldStatus = ObjectValues<typeof FORM_FIELD_STATUS>;