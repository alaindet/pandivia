import { Component } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import {
  matClear,
  matMoreHoriz,
  matTaskAlt,
  matUndo,
} from '@ng-icons/material-icons/baseline';
import { IconButtonComponent } from '@fruit/components';
import {
  ActionsMenuComponent,
  ActionsMenuButtonDirective,
  ActionsMenuItemDirective,
  ActionsMenuItem,
} from '@fruit/components';
import { PageHeaderComponent } from '@fruit/components';

@Component({
  selector: 'app-demo-page-header',
  imports: [
    PageHeaderComponent,
    ActionsMenuComponent,
    ActionsMenuButtonDirective,
    ActionsMenuItemDirective,
    NgIcon,
    IconButtonComponent,
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
