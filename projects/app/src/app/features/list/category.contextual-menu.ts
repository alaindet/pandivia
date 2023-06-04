import { ActionsMenuItem } from '@app/common/components';

export const CATEGORY_ACTION_COMPLETE: ActionsMenuItem = {
  id: 'category:complete',
  label: 'Complete all items', // TODO: Translate
  icon: 'check',
};

export const CATEGORY_ACTION_UNDO: ActionsMenuItem = {
  id: 'category:undo',
  label: 'Undo all items', // TODO: Translate
  icon: 'undo',
};

export const CATEGORY_ACTION_REMOVE_COMPLETED: ActionsMenuItem = {
  id: 'category:complete',
  label: 'Remove all completed items', // TODO: Translate
  icon: 'remove_done',
};

export const CATEGORY_ACTION_REMOVE: ActionsMenuItem = {
  id: 'category:remove',
  label: 'Remove all items', // TODO: Translate
  icon: 'delete',
};

export const CATEGORY_CONTEXTUAL_MENU: ActionsMenuItem[] = [
  CATEGORY_ACTION_COMPLETE,
  CATEGORY_ACTION_UNDO,
  CATEGORY_ACTION_REMOVE_COMPLETED,
  CATEGORY_ACTION_REMOVE,
];