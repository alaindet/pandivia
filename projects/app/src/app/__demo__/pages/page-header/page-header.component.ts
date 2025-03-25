import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import {
  ACTIONS_MENU_EXPORTS,
  ActionsMenuItem,
  ButtonComponent,
  PageHeaderComponent,
} from '@app/common/components';

@Component({
  selector: 'app-demo-page-header',
  imports: [
    PageHeaderComponent,
    ...ACTIONS_MENU_EXPORTS,
    MatIconModule,
    ButtonComponent,
  ],
  templateUrl: './page-header.component.html',
})
export class PageHeaderDemoPageComponent {
  consoleLog = console.log;
  actions: ActionsMenuItem[] = [
    { id: 'check', label: 'Check', icon: 'task_alt' },
    { id: 'uncheck', label: 'Uncheck', icon: 'undo' },
    { id: 'remove', label: 'Remove', icon: 'clear' },
  ];
}
