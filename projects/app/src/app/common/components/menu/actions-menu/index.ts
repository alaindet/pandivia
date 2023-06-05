export * from './directives/actions-menu-button.directive';
export * from './directives/actions-menu-item.directive';
export * from './actions-menu.component';
export * from './types';

import { ActionsMenuComponent } from './actions-menu.component';
import { ActionsMenuButtonDirective } from './directives/actions-menu-button.directive';
import { ActionsMenuItemDirective } from './directives/actions-menu-item.directive';

export const ACTIONS_MENU_EXPORTS = [
  ActionsMenuComponent,
  ActionsMenuButtonDirective,
  ActionsMenuItemDirective,
];