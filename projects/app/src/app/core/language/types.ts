import { EnumLike } from '@fixcommon/types';

export const LANGUAGE = {
  ITALIANO: 'it',
  ENGLISH: 'en',
} as const;

export type Language = EnumLike<typeof LANGUAGE>;
