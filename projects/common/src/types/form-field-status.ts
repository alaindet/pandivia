import { EnumLike } from './enum-like';

export const FORM_FIELD_STATUS = {
  ERROR: 'error',
  SUCCESS: 'success',
  NONE: 'none',
} as const;

export type FormFieldStatus = EnumLike<typeof FORM_FIELD_STATUS>;
