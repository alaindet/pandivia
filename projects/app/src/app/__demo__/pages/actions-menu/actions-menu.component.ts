import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import {
  ACTIONS_MENU_EXPORTS,
  ActionsMenuItem,
  ButtonComponent,
} from '@app/common/components';

@Component({
  selector: 'app-demo-actions-menu',
  imports: [...ACTIONS_MENU_EXPORTS, ButtonComponent, MatIconModule],
  templateUrl: './actions-menu.component.html',
})
export class ActionsMenuDemoPageComponent {
  consoleLog = console.log;

  actions: ActionsMenuItem[] = [
    { id: 'check', label: 'Check', icon: 'task_alt' },
    { id: 'uncheck', label: 'Uncheck', icon: 'undo' },
    { id: 'remove', label: 'Remove', icon: 'clear' },
  ];
}
