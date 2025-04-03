import { Directive, OnInit, TemplateRef, inject } from '@angular/core';

import { AutocompleteService } from '../autocomplete.service';
import { AutocompleteOption } from '../types';

@Directive({
  selector: '[appAutocompleteOption]',
})
export class AutocompleteOptionDirective implements OnInit {
  private svc = inject(AutocompleteService);
  private template = inject(TemplateRef<{ $implicit: AutocompleteOption }>);

  ngOnInit() {
    this.svc.setOptionTemplate(this.template);
  }
}
