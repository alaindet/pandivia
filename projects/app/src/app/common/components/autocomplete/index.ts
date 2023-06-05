export * from './autocomplete-option.component';
export * from './autocomplete-option.directive';
export * from './autocomplete.component';
export * from './types';

import { AutocompleteOptionDirective } from './autocomplete-option.directive';
import { AutocompleteComponent } from './autocomplete.component';

export const AUTOCOMPLETE_EXPORTS = [
  AutocompleteComponent,
  AutocompleteOptionDirective,
];