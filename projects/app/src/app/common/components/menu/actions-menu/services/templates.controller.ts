import { TemplateRef } from '@angular/core';

import { DataSource } from '@app/common/sources';
import { TemplateImplicitContext } from '@app/common/types';
import { ActionsMenuService } from './actions-menu.service';
import { ActionsMenuItem, ActionsMenuTemplates } from '../types';

export function createTemplatesController(parent: ActionsMenuService) {

  const templates$ = new DataSource<ActionsMenuTemplates>(
    { button: null, item: null },
    parent.core.destroy$,
  );

  function setButton(button: TemplateRef<void>) {
    templates$.next(templates => ({ ...templates, button }));
  }

  function setItem(item: TemplateRef<TemplateImplicitContext<ActionsMenuItem>>) {
    templates$.next(templates => ({ ...templates, item }));
  }

  return {
    templates$: templates$.data$,
    setButton,
    setItem,
  };
}
