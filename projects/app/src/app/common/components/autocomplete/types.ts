import { ObjectValues } from '@app/common/types';
import { Observable } from 'rxjs';

export type AutocompleteOption = any;

export interface AutocompleteOptionValuesMap {
  [index: number]: string;
}

export const AUTOCOMPLETE_SOURCE_TYPE = {
  STATIC: 'static',
  ASYNC: 'async',
} as const;

export type AutocompleteSourceType = ObjectValues<typeof AUTOCOMPLETE_SOURCE_TYPE>;

export type AutocompleteAsyncOptionsFn = (query: string) => Observable<AutocompleteOption[]>;

export type AutocompleteOptionValuePicker = (option: AutocompleteOption) => string;
