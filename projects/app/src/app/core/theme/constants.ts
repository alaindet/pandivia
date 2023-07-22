import { FormOption } from '@app/common/types';
import { THEME } from './types';

export const THEME_STORAGE_KEY = 'pandivia:theme';

export const DEFAULT_THEME = THEME.GOLDEN;

export const THEME_CONFIG = {
  [THEME.GOLDEN]: {
    id: THEME.GOLDEN,
    themeColor: '#dcb41c',
    checkboxColor: 'black',
    fabColor: 'primary',
    filterColor: 'secondary',
    linearSpinnerColor: 'primary',
    quickNumberColor: 'primary',
    label: 'Golden',
  },
  [THEME.FAIRY]: {
    id: THEME.FAIRY,
    themeColor: '#b3849b',
    checkboxColor: 'tertiary',
    fabColor: 'tertiary',
    filterColor: 'tertiary',
    linearSpinnerColor: 'tertiary',
    quickNumberColor: 'primary',
    label: 'Fairy',
  },
} as const;

export const THEME_OPTIONS: FormOption[] = Object.values(THEME_CONFIG)
  .map(({ id: value, label }) => ({ value, label }));
