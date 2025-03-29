import { ActionsMenuItem } from '@ui/components/actions-menu';
import {
  matAddCircle,
  matCheck,
  matDelete,
  matRemoveDone,
  matUndo,
} from '@ng-icons/material-icons/baseline';

export const CATEGORY_ACTION_CREATE_ITEM: ActionsMenuItem = {
  id: 'category:create-item',
  label: 'common.menu.createNewItem',
  icon: matAddCircle,
};

export const CATEGORY_ACTION_COMPLETE: ActionsMenuItem = {
  id: 'category:complete',
  label: 'common.menu.completeAllItems',
  icon: matCheck,
};

export const CATEGORY_ACTION_UNDO: ActionsMenuItem = {
  id: 'category:undo',
  label: 'common.menu.undoAllItems',
  icon: matUndo,
};

export const CATEGORY_ACTION_REMOVE_COMPLETED: ActionsMenuItem = {
  id: 'category:remove-completed',
  label: 'common.menu.removeCompletedItems',
  icon: matRemoveDone,
};

export const CATEGORY_ACTION_REMOVE: ActionsMenuItem = {
  id: 'category:remove',
  label: 'common.menu.removeAllItems',
  icon: matDelete,
};

export const CATEGORY_CONTEXTUAL_MENU = [
  CATEGORY_ACTION_CREATE_ITEM,
  CATEGORY_ACTION_COMPLETE,
  CATEGORY_ACTION_UNDO,
  CATEGORY_ACTION_REMOVE_COMPLETED,
  CATEGORY_ACTION_REMOVE,
];
