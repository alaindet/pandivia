import { ObjectValues } from '@app/common/types';
import { Observable } from 'rxjs';

export type AutocompleteOption = any;

export interface AutocompleteOptionValuesMap {
  [index: number]: string;
}

export const AUTOCOMPLETE_SOURCE = {
  STATIC: 'static',
  ASYNC: 'async',
} as const;

export type AutocompleteSource = ObjectValues<typeof AUTOCOMPLETE_SOURCE>;

export type AutocompleteAsyncOptionsFn = (query: string) => Observable<AutocompleteOption[]>;

export type AutocompleteOptionValuePicker = (option: AutocompleteOption) => string;
