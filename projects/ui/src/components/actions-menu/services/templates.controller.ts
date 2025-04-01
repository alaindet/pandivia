import { TemplateRef, signal } from '@angular/core';

import { ActionsMenuItem } from '../types';
import { ActionsMenuService } from './actions-menu.service';

export function createTemplatesController(parent: ActionsMenuService) {
  const button = signal<TemplateRef<{ $implicit: boolean }> | null>(null);
  const item = signal<TemplateRef<{ $implicit: ActionsMenuItem }> | null>(null);

  function setButton(_button: TemplateRef<{ $implicit: boolean }>) {
    button.set(_button);
  }

  function setItem(_item: TemplateRef<{ $implicit: ActionsMenuItem }>) {
    item.set(_item);
  }

  return {
    button: button.asReadonly(),
    item: item.asReadonly(),
    setButton,
    setItem,
  };
}
