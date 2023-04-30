import { Injectable, OnDestroy } from '@angular/core';

import { createCoreController } from './core.controller';
import { createMenuController } from './menu.controller';
import { createActionsController } from './actions.controller';
import { createTemplatesController } from './templates.controller';
import { createIdsController } from './ids.controller';
import { createFocusController } from './focus.controller';
import { createButtonElementController } from './button-element.controller';
import { createInitController } from './init.controller';
import { createViewModelController } from './view-model.controller';
import { createItemsElementController } from './items-element.controller';

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
  init = createInitController(this);
  vm = createViewModelController(this);

  ngOnDestroy() {
    this.core.destructor();
  }
}
