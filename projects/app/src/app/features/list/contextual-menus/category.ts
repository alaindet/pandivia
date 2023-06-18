import { TranslocoService } from '@ngneat/transloco';
import { inject } from '@angular/core';
import { ActionsMenuItem } from '@app/common/components';

export const CATEGORY_ACTION_CREATE_ITEM: ActionsMenuItem = {
  id: 'category:create-item',
  label: 'list.menu.categoryCreateItem',
  icon: 'add_circle',
};

export const CATEGORY_ACTION_COMPLETE: ActionsMenuItem = {
  id: 'category:complete',
  label: 'list.menu.categoryComplete',
  icon: 'check',
};

export const CATEGORY_ACTION_UNDO: ActionsMenuItem = {
  id: 'category:undo',
  label: 'list.menu.categoryUndo',
  icon: 'undo',
};

export const CATEGORY_ACTION_REMOVE_COMPLETED: ActionsMenuItem = {
  id: 'category:remove-completed',
  label: 'list.menu.categoryRemoveCompleted',
  icon: 'remove_done',
};

export const CATEGORY_ACTION_REMOVE: ActionsMenuItem = {
  id: 'category:remove',
  label: 'list.menu.categoryRemoveAll',
  icon: 'delete',
};

export function getCategoryContextualMenu(): ActionsMenuItem[] {

  const transloco = inject(TranslocoService); // TODO?

  return [
    CATEGORY_ACTION_CREATE_ITEM,
    CATEGORY_ACTION_COMPLETE,
    CATEGORY_ACTION_UNDO,
    CATEGORY_ACTION_REMOVE_COMPLETED,
    CATEGORY_ACTION_REMOVE,
  ].map(action => ({ ...action, label: transloco.translate(action.label) }));
}
