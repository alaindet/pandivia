import { Directive, TemplateRef, inject } from '@angular/core';
import { TemplateImplicitContext } from '@common/types';

import { ActionsMenuItem } from '../types';

@Directive({
  selector: '[appActionsMenuItem]',
  host: { class: 'app-actions-menu-button' },
})
export class ActionsMenuItemDirective {
  template = inject(TemplateRef<TemplateImplicitContext<ActionsMenuItem>>);
}
