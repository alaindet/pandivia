import { ObjectValues } from '@app/common/types';
import { ButtonColor, CheckboxColor } from '@app/common/components';

export const THEME = {
  GOLDEN: 'golden',
  FAIRY: 'fairy',
} as const;

export type Theme = ObjectValues<typeof THEME>;

export type CssColorValue = string;

export type ThemeConfig = {
  id: Theme;
  themeColor: CssColorValue;
  checkboxColor: CheckboxColor;
  fabColor: ButtonColor;
  filterColor: ButtonColor;
  label: string;
};
