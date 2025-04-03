import { computed, signal } from '@angular/core';

import { ActionsMenuService } from './actions-menu.service';

function addSuffix(id: string | null, suffix: string): string {
  return id ? `${id}-${suffix}` : '';
}

export function createIdsController(parent: ActionsMenuService) {
  const id = signal<string | null>(null);
  const button = computed(() => addSuffix(id(), 'button'));
  const items = computed(() => addSuffix(id(), 'items'));

  function init(_id: string) {
    id.set(_id);
  }

  return {
    init,
    button,
    items,
  };
}
