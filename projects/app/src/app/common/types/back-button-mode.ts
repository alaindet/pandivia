import { EnumLike } from './enum-like';

export const BACK_BUTTON_MODE = {
  NONE: 'none',
  NATIVE: 'native', // Navigates back
  CONTROLLED: 'controlled',
} as const;

export type BackButtonMode = EnumLike<typeof BACK_BUTTON_MODE>;
