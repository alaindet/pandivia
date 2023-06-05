import { Directive, TemplateRef, inject } from '@angular/core';

import { AutocompleteService } from './autocomplete.service';
import { AutocompleteOption } from './types';
import { TemplateImplicitContext } from '@app/common/types';

@Directive({
  selector: '[appAutocompleteOption]',
  standalone: true,
})
export class AutocompleteOptionDirective {
  constructor() {
    inject(AutocompleteService).setOptionTemplate(
      inject(TemplateRef<TemplateImplicitContext<AutocompleteOption>>),
    );
  }
}
