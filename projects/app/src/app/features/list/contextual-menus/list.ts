import { ActionsMenuItem } from '@app/common/components';

export const LIST_ACTION_REFRESH: ActionsMenuItem = {
  id: 'list:refresh',
  label: 'Refresh', // TODO: Translate
  icon: 'refresh',
};

export const LIST_ACTION_SHOW_COMPLETED: ActionsMenuItem = {
  id: 'list:show-completed',
  label: 'Show completed items', // TODO: Translate
  icon: 'filter_alt',
};

export const LIST_ACTION_HIDE_COMPLETED: ActionsMenuItem = {
  id: 'list:hide-completed',
  label: 'Hide completed items', // TODO: Translate
  icon: 'filter_alt',
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

export function getListContextualMenu(showCompleted: boolean): ActionsMenuItem[] {
  return [
    LIST_ACTION_REFRESH,
    showCompleted ? LIST_ACTION_SHOW_COMPLETED : LIST_ACTION_HIDE_COMPLETED,
    LIST_ACTION_COMPLETE,
    LIST_ACTION_UNDO,
    LIST_ACTION_REMOVE_COMPLETED,
    LIST_ACTION_REMOVE,
  ];
}
