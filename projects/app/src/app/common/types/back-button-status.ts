import { ObjectValues } from './object-values';

export const BACK_BUTTON_STATUS = {
  NONE: 'none',
  NATIVE: 'native', // Navigates back
  CONTROLLED: 'controlled',
} as const;

export type BackButtonStatus = ObjectValues<typeof BACK_BUTTON_STATUS>;
