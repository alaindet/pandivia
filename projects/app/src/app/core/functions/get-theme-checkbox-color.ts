import { CheckboxColor } from '@app/common/components';
import { THEME, Theme } from '../types';

// TODO: Centralize in a "theme config"?
export function getThemeCheckboxColor(theme: Theme): CheckboxColor {
  switch (theme) {
    case THEME.FAIRY: return 'secondary';
    case THEME.GOLDEN: return 'black';
    default: return 'black';
  }
}