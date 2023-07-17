import { ObjectValues } from '@app/common/types';

export const THEME = {
  GOLDEN: 'golden',
  FAIRY: 'fairy',
} as const;

export type Theme = ObjectValues<typeof THEME>;

export type CssColorValue = string;

export type ThemeConfig = {
  id: Theme;
  themeColor: CssColorValue;
  label: string;
};
