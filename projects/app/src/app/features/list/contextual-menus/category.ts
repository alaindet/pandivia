import { ActionsMenuItem } from '@app/common/components';

export const CATEGORY_ACTION_CREATE_ITEM: ActionsMenuItem = {
  id: 'category:create-item',
  label: 'common.menu.createNewItem',
  icon: 'add_circle',
};

export const CATEGORY_ACTION_COMPLETE: ActionsMenuItem = {
  id: 'category:complete',
  label: 'common.menu.completeAllItems',
  icon: 'check',
};

export const CATEGORY_ACTION_UNDO: ActionsMenuItem = {
  id: 'category:undo',
  label: 'common.menu.undoAllItems',
  icon: 'undo',
};

export const CATEGORY_ACTION_REMOVE_COMPLETED: ActionsMenuItem = {
  id: 'category:remove-completed',
  label: 'common.menu.removeCompletedItems',
  icon: 'remove_done',
};

export const CATEGORY_ACTION_REMOVE: ActionsMenuItem = {
  id: 'category:remove',
  label: 'common.menu.removeAllItems',
  icon: 'delete',
};

export const CATEGORY_CONTEXTUAL_MENU = [
  CATEGORY_ACTION_CREATE_ITEM,
  CATEGORY_ACTION_COMPLETE,
  CATEGORY_ACTION_UNDO,
  CATEGORY_ACTION_REMOVE_COMPLETED,
  CATEGORY_ACTION_REMOVE,
];
