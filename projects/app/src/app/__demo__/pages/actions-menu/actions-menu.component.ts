import { Component } from '@angular/core';
import {
  matClear,
  matTaskAlt,
  matUndo,
} from '@ng-icons/material-icons/baseline';
import { ButtonComponent } from '@ui/components/button';
import {
  ACTIONS_MENU_EXPORTS,
  ActionsMenuItem,
} from '@ui/components/actions-menu';

@Component({
  selector: 'app-demo-actions-menu',
  imports: [...ACTIONS_MENU_EXPORTS, ButtonComponent],
  templateUrl: './actions-menu.component.html',
})
export class ActionsMenuDemoPageComponent {
  consoleLog = console.log;

  actions: ActionsMenuItem[] = [
    { id: 'check', label: 'Check', icon: matTaskAlt },
    { id: 'uncheck', label: 'Uncheck', icon: matUndo },
    { id: 'remove', label: 'Remove', icon: matClear },
  ];
}
