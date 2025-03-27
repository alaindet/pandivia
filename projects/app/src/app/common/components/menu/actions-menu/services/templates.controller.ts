import { TemplateRef, signal } from '@angular/core';
import { TemplateImplicitContext } from '@common/types';

import { ActionsMenuItem } from '../types';
import { ActionsMenuService } from './actions-menu.service';

export function createTemplatesController(parent: ActionsMenuService) {
  const button = signal<TemplateRef<TemplateImplicitContext<boolean>> | null>(
    null
  );
  const item = signal<TemplateRef<
    TemplateImplicitContext<ActionsMenuItem>
  > | null>(null);

  function setButton(_button: TemplateRef<TemplateImplicitContext<boolean>>) {
    button.set(_button);
  }

  function setItem(
    _item: TemplateRef<TemplateImplicitContext<ActionsMenuItem>>
  ) {
    item.set(_item);
  }

  return {
    button: button.asReadonly(),
    item: item.asReadonly(),
    setButton,
    setItem,
  };
}
