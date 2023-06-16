import { FormOption } from '@app/common/types';
import { THEME } from './types';

export const THEME_STORAGE_KEY = 'pandivia:theme';

export const DEFAULT_THEME = THEME.GOLDEN;

export const THEME_OPTIONS: FormOption[] = [
  { value: THEME.GOLDEN, label: 'Golden' },
  { value: THEME.FAIRY, label: 'Fairy' },
];
