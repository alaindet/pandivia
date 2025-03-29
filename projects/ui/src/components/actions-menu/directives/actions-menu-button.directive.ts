import { Directive, TemplateRef, inject } from '@angular/core';
import { TemplateImplicitContext } from '@common/types';

@Directive({
  selector: '[appActionsMenuButton]',
  host: { class: 'app-actions-menu-button' },
})
export class ActionsMenuButtonDirective {
  template = inject(TemplateRef<TemplateImplicitContext<boolean>>);
}
