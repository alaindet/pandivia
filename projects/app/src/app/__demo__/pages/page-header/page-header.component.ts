import { Component } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import {
  matClear,
  matMoreHoriz,
  matTaskAlt,
  matUndo,
} from '@ng-icons/material-icons/baseline';

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
    NgIcon,
    ButtonComponent,
  ],
  templateUrl: './page-header.component.html',
})
export class PageHeaderDemoPageComponent {
  consoleLog = console.log;
  matMoreHoriz = matMoreHoriz;
  actions: ActionsMenuItem[] = [
    { id: 'check', label: 'Check', icon: matTaskAlt },
    { id: 'uncheck', label: 'Uncheck', icon: matUndo },
    { id: 'remove', label: 'Remove', icon: matClear },
  ];
}
