import { FormOption } from '@app/common/types';
import { LANGUAGE } from './types';

export const DEFAULT_LANGUAGE = LANGUAGE.ITALIANO;

export const LANGUAGE_STORAGE_KEY = 'pandivia:language';

export const LANGUAGE_OPTIONS: FormOption[] = [
  { value: LANGUAGE.ITALIANO, label: 'Italiano' },
  { value: LANGUAGE.ENGLISH, label: 'English' },
];
