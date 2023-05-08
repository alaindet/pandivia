import { ObjectValues } from '@app/common/types';

export const QUICK_INPUT_MODE = {
  CHOICES: 'choices',
  EDITING: 'editing',
} as const;

export type QuickInputMode = ObjectValues<typeof QUICK_INPUT_MODE>;
