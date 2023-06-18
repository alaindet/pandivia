import { ActionsMenuItem } from '@app/common/components';

export const LIST_ACTION_REFRESH: ActionsMenuItem = {
  id: 'list:refresh',
  label: 'common.menu.refresh',
  icon: 'refresh',
};

export const LIST_ACTION_SHOW_COMPLETED: ActionsMenuItem = {
  id: 'list:show-completed',
  label: 'common.menu.showCompletedItems',
  icon: 'filter_alt',
};

export const LIST_ACTION_HIDE_COMPLETED: ActionsMenuItem = {
  id: 'list:hide-completed',
  label: 'common.menu.hideCompletedItems',
  icon: 'filter_alt',
};

export const LIST_ACTION_COMPLETE: ActionsMenuItem = {
  id: 'list:complete',
  label: 'common.menu.completeAllItems',
  icon: 'check',
};

export const LIST_ACTION_UNDO: ActionsMenuItem = {
  id: 'list:undo',
  label: 'common.menu.undoAllItems',
  icon: 'undo',
};

export const LIST_ACTION_REMOVE_COMPLETED: ActionsMenuItem = {
  id: 'list:remove-completed',
  label: 'common.menu.removeCompletedItems',
  icon: 'remove_done',
};

export const LIST_ACTION_REMOVE: ActionsMenuItem = {
  id: 'list:remove',
  label: 'common.menu.removeAllItems',
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
