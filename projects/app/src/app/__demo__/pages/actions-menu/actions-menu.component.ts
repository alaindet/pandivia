import { Component } from '@angular/core';
import {
  matClear,
  matTaskAlt,
  matUndo,
} from '@ng-icons/material-icons/baseline';
import { ButtonComponent } from '@ui/components';
import {
  ActionsMenuComponent,
  ActionsMenuButtonDirective,
  ActionsMenuItemDirective,
  ActionsMenuItem,
} from '@ui/components';

@Component({
  selector: 'app-demo-actions-menu',
  imports: [ActionsMenuComponent, ActionsMenuButtonDirective, ButtonComponent],
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
