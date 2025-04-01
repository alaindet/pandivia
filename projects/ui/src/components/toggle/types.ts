import { EnumLike } from '@fixcommon/types';

export const TOGGLE_LABEL_POSITION = {
  LEFT: 'left',
  LEFT_FULLWIDTH: 'left-fullwidth',
  RIGHT: 'right',
  RIGHT_FULLWIDTH: 'right-fullwidth',
} as const;

export type ToggleLabelPosition = EnumLike<typeof TOGGLE_LABEL_POSITION>;

export type ToggleColor = 'primary' | 'secondary' | 'tertiary';
