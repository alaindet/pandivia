import { Component } from '@angular/core';
import { ACTIONS_MENU_EXPORTS, ActionsMenuItem } from '@app/common/components/menu/actions-menu';
import { MatIconModule } from '@angular/material/icon';

import { ButtonComponent } from '@app/common/components/button';

const IMPORTS = [
  ...ACTIONS_MENU_EXPORTS,
  ButtonComponent,
  MatIconModule,
];

@Component({
  selector: 'app-demo-actions-menu',
  standalone: true,
  imports: IMPORTS,
  templateUrl: './actions-menu.component.html',
})
export class MenuDemoPageComponent {

  consoleLog = console.log;

  actions: ActionsMenuItem[] = [
    { id: 'check', label: 'Check', icon: 'task_alt' },
    { id: 'uncheck', label: 'Uncheck', icon: 'undo' },
    { id: 'remove', label: 'Remove', icon: 'clear' },
  ];
}
