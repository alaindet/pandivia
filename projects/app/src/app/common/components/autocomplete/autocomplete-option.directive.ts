import { Directive, OnInit, TemplateRef, inject } from '@angular/core';

import { AutocompleteService } from './autocomplete.service';
import { AutocompleteOption } from './types';
import { TemplateImplicitContext } from '@app/common/types';

@Directive({
  selector: '[appAutocompleteOption]',
  standalone: true,
})
export class AutocompleteOptionDirective implements OnInit {

  private svc = inject(AutocompleteService);
  private template = inject(TemplateRef<TemplateImplicitContext<AutocompleteOption>>);

  ngOnInit() {
    this.svc.setOptionTemplate(this.template);
  }
}
