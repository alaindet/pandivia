import { ObjectValues } from '@app/common/types';

export const TOGGLE_LABEL_POSITION = {
  LEFT: 'left',
  LEFT_FULLWIDTH: 'left-fullwidth',
  RIGHT: 'right',
  RIGHT_FULLWIDTH: 'right-fullwidth',
} as const;

export type ToggleLabelPosition = ObjectValues<typeof TOGGLE_LABEL_POSITION>;
