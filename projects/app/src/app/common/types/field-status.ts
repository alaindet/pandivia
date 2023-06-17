import { ObjectValues } from './object-values';

export const FIELD_STATUS = {
  ERROR: 'error',
  SUCCESS: 'success',
  NONE: 'none',
} as const;

export type FieldStatus = ObjectValues<typeof FIELD_STATUS>;