import { EnumLike } from '@fixcommon/types';
import { CheckboxColor } from '@ui/components/checkbox';
import { ButtonColor } from '@ui/components/button';

import { LinearSpinnerColor } from '@ui/components/linear-spinner';

export const THEME = {
  GOLDEN: 'golden',
  FAIRY: 'fairy',
} as const;

export type Theme = EnumLike<typeof THEME>;

export type CssColorValue = string;

export type ThemeConfig = {
  id: Theme;
  themeColor: CssColorValue;
  checkboxColor: CheckboxColor;
  fabColor: ButtonColor;
  filterColor: ButtonColor;
  linearSpinnerColor: LinearSpinnerColor;
  quickNumberColor: ButtonColor;
  label: string;
};
