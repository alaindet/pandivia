import { FormControl } from '@angular/forms';
import { EnumLike } from '@common/types';

export type FormControlDescriptor = Pick<
  FormControl,
  'value' | 'touched' | 'valid' | 'errors'
>;

export const FORM_FIELD_STATUS = {
  ERROR: 'error',
  SUCCESS: 'success',
  NONE: 'none',
} as const;

export type FormFieldStatus = EnumLike<typeof FORM_FIELD_STATUS>;
