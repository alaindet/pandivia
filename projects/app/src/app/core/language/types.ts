import { EnumLike } from '@app/common/types';

export const LANGUAGE = {
  ITALIANO: 'it',
  ENGLISH: 'en',
} as const;

export type Language = EnumLike<typeof LANGUAGE>;
