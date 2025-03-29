export * from './autocomplete-option/autocomplete-option.component';
export * from './autocomplete-option/autocomplete-option.directive';
export * from './autocomplete/autocomplete.component';
export * from './types';

import { AutocompleteOptionDirective } from './autocomplete-option/autocomplete-option.directive';
import { AutocompleteComponent } from './autocomplete/autocomplete.component';

export const AUTOCOMPLETE_EXPORTS = [
  AutocompleteComponent,
  AutocompleteOptionDirective,
];
