import { ObjectValues } from '@app/common/types';
import { Observable } from 'rxjs';

export type AutocompleteOption = any;

export interface AutocompleteOptionValuesMap {
  [index: number]: string;
}

export const AUTOCOMPLETE_CURRENT_TEMPLATE = {
  LOADING: 'loading',
  EMPTY: 'empty',
  OPTIONS: 'options',
} as const;

export type AutocompleteCurrentTemplate = ObjectValues<typeof AUTOCOMPLETE_CURRENT_TEMPLATE>;

export const AUTOCOMPLETE_SOURCE_TYPE = {
  STATIC: 'static',
  ASYNC: 'async',
} as const;

export type AutocompleteSourceType = ObjectValues<typeof AUTOCOMPLETE_SOURCE_TYPE>;

export type AutocompleteAsyncOptionsFn = (query: string) => Observable<AutocompleteOption[]>;

export type AutocompleteOptionValuePicker = (option: AutocompleteOption) => string;


export const AUTOCOMPLETE_ITEMS_TEMPLATE = {
  LOADING: 'loading',
  NO_OPTIONS: 'noOptions',
  OPTIONS: 'options',
} as const;

export type AutocompleteItemsTemplate = ObjectValues<typeof AUTOCOMPLETE_ITEMS_TEMPLATE>;

export type AutocompleteComponentLabels = {
  loading: string;
  nothingFound: string;
};
