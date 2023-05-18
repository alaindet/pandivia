import { Directive, TemplateRef, inject } from '@angular/core';

import { ActionsMenuItem } from '../types';

@Directive({
  selector: '[appActionsMenuItem]',
  standalone: true,
  host: { class: 'app-actions-menu-button' },
})
export class ActionsMenuItemDirective {
  template = inject(TemplateRef<{ $implicit: ActionsMenuItem }>);
}
