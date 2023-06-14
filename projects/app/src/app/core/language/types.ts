import { ObjectValues } from '@app/common/types';

export const LANGUAGE = {
  ITALIANO: 'it',
  ENGLISH: 'en',
} as const;

export type Language = ObjectValues<typeof LANGUAGE>;
