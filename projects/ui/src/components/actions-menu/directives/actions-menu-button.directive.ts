import { Directive, TemplateRef, inject } from '@angular/core';

@Directive({
  selector: '[appActionsMenuButton]',
  host: { class: 'app-actions-menu-button' },
})
export class ActionsMenuButtonDirective {
  template = inject(TemplateRef<{ $implicit: boolean }>);
}
