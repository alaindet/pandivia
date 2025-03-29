import {
  matCheck,
  matFilterAlt,
  matRefresh,
  matRemoveDone,
  matUndo,
} from '@ng-icons/material-icons/baseline';
import { ActionsMenuItem } from '@ui/components/actions-menu';

export const LIST_ACTION_REFRESH: ActionsMenuItem = {
  id: 'list:refresh',
  label: 'common.menu.refresh',
  icon: matRefresh,
};

export const LIST_ACTION_SHOW_COMPLETED: ActionsMenuItem = {
  id: 'list:show-completed',
  label: 'common.menu.showCompletedItems',
  icon: matFilterAlt,
};

export const LIST_ACTION_HIDE_COMPLETED: ActionsMenuItem = {
  id: 'list:hide-completed',
  label: 'common.menu.hideCompletedItems',
  icon: matFilterAlt,
};

export const LIST_ACTION_COMPLETE: ActionsMenuItem = {
  id: 'list:complete',
  label: 'common.menu.completeAllItems',
  icon: matCheck,
};

export const LIST_ACTION_UNDO: ActionsMenuItem = {
  id: 'list:undo',
  label: 'common.menu.undoAllItems',
  icon: matUndo,
};

export const LIST_ACTION_REMOVE_COMPLETED: ActionsMenuItem = {
  id: 'list:remove-completed',
  label: 'common.menu.removeCompletedItems',
  icon: matRemoveDone,
};

export function getListContextualMenu(
  showCompleted: boolean
): ActionsMenuItem[] {
  return [
    LIST_ACTION_REFRESH,
    showCompleted ? LIST_ACTION_SHOW_COMPLETED : LIST_ACTION_HIDE_COMPLETED,
    LIST_ACTION_COMPLETE,
    LIST_ACTION_UNDO,
    LIST_ACTION_REMOVE_COMPLETED,
  ];
}
