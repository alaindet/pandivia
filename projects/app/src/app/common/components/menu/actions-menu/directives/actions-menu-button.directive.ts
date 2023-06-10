import { Directive, TemplateRef, inject } from '@angular/core';

import { TemplateImplicitContext } from '@app/common/types';

@Directive({
  selector: '[appActionsMenuButton]',
  standalone: true,
  host: { class: 'app-actions-menu-button' },
})
export class ActionsMenuButtonDirective {
  template = inject(TemplateRef<TemplateImplicitContext<boolean>>);
}
