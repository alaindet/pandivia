import { EnumLike } from './enum-like';

export const KEYBOARD_KEY = {
  TAB: 'Tab',
  SPACE: ' ',
  ENTER: 'Enter',
  ARROW_DOWN: 'ArrowDown',
  DOWN: 'Down',
  ESC: 'Esc',
  ESCAPE: 'Escape',
  UP: 'Up',
  ARROW_UP: 'ArrowUp',
  HOME: 'Home',
  PAGE_UP: 'PageUp',
  END: 'End',
  PAGE_DOWN: 'PageDown',
} as const;

export type KeyboardKey = EnumLike<typeof KEYBOARD_KEY>;
