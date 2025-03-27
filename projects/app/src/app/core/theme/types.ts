import { EnumLike } from '@common/types';

import {
  ButtonColor,
  CheckboxColor,
  LinearSpinnerColor,
} from '@app/common/components';

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
