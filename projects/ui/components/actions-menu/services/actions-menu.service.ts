import { Injectable, OnDestroy } from '@angular/core';

import { createActionsController } from './actions.controller';
import { createButtonElementController } from './button-element.controller';
import { createCoreController } from './core.controller';
import { createFocusController } from './focus.controller';
import { createIdsController } from './ids.controller';
import { createItemsElementController } from './items-element.controller';
import { createMenuController } from './menu.controller';
import { createTemplatesController } from './templates.controller';

@Injectable()
export class ActionsMenuService implements OnDestroy {

  core = createCoreController(this);
  buttonElement = createButtonElementController(this);
  itemsElement = createItemsElementController(this);
  menu = createMenuController(this);
  actions = createActionsController(this);
  templates = createTemplatesController(this);
  ids = createIdsController(this);
  focus = createFocusController(this);

  ngOnDestroy() {
    this.core.destroy();
    this.buttonElement.destroy();
    this.itemsElement.destroy();
    this.menu.destroy();
    this.actions.destroy();
  }
}
