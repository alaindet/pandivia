import { EnumLike } from './enum-like';

export const BACK_BUTTON_STATUS = {
  NONE: 'none',
  NATIVE: 'native', // Navigates back
  CONTROLLED: 'controlled',
} as const;

export type BackButtonStatus = EnumLike<typeof BACK_BUTTON_STATUS>;
