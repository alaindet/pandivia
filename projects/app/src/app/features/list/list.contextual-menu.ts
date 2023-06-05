import { ActionsMenuItem } from '@app/common/components';

export const LIST_ACTION_REFRESH: ActionsMenuItem = {
  id: 'list:refresh',
  label: 'Refresh', // TODO: Translate
  icon: 'refresh',
};

export const LIST_ACTION_COMPLETE: ActionsMenuItem = {
  id: 'list:complete',
  label: 'Complete all items', // TODO: Translate
  icon: 'check',
};

export const LIST_ACTION_UNDO: ActionsMenuItem = {
  id: 'list:undo',
  label: 'Undo all items', // TODO: Translate
  icon: 'undo',
};

export const LIST_ACTION_REMOVE_COMPLETED: ActionsMenuItem = {
  id: 'list:remove-completed',
  label: 'Remove all completed items', // TODO: Translate
  icon: 'remove_done',
};

export const LIST_ACTION_REMOVE: ActionsMenuItem = {
  id: 'list:remove',
  label: 'Remove all items', // TODO: Translate
  icon: 'delete',
};

export const LIST_CONTEXTUAL_MENU: ActionsMenuItem[] = [
  LIST_ACTION_REFRESH,
  LIST_ACTION_COMPLETE,
  LIST_ACTION_UNDO,
  LIST_ACTION_REMOVE_COMPLETED,
  LIST_ACTION_REMOVE,
];
