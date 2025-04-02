import { EnumLike } from '@common/types';
import { CheckboxColor } from '@fruit/components/checkbox';
import { ButtonColor } from '@fruit/components/button';

import { LinearSpinnerColor } from '@fruit/components/linear-spinner';

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
