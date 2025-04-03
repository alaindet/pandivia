import { ActionsMenuItem } from '@ui/components';
import { ListItem } from '../types';
import {
  matAddCircle,
  matCheck,
  matDelete,
  matEdit,
  matLowPriority,
  matRemoveCircle,
  matUndo,
} from '@ng-icons/material-icons/baseline';

export const ITEM_ACTION_COMPLETE: ActionsMenuItem = {
  id: 'item:complete',
  label: 'common.menu.complete',
  icon: matCheck,
};

export const ITEM_ACTION_UNDO: ActionsMenuItem = {
  id: 'item:undo',
  label: 'common.menu.undo',
  icon: matUndo,
};

export const ITEM_ACTION_INCREMENT: ActionsMenuItem = {
  id: 'item:increment',
  label: 'common.menu.increment',
  icon: matAddCircle,
};

export const ITEM_ACTION_DECREMENT: ActionsMenuItem = {
  id: 'item:decrement',
  label: 'common.menu.decrement',
  icon: matRemoveCircle,
};

export const ITEM_ACTION_EDIT: ActionsMenuItem = {
  id: 'item:edit',
  label: 'common.menu.edit',
  icon: matEdit,
};

export const ITEM_ACTION_MOVE_TO_CATEGORY: ActionsMenuItem = {
  id: 'item:move-to-category',
  label: 'common.menu.moveToCategory',
  icon: matLowPriority,
};

export const ITEM_ACTION_REMOVE: ActionsMenuItem = {
  id: 'item:remove',
  label: 'common.menu.remove',
  icon: matDelete,
};

export function getItemContextualMenu(item: ListItem): ActionsMenuItem[] {
  return [
    item.isDone ? ITEM_ACTION_UNDO : ITEM_ACTION_COMPLETE,
    ITEM_ACTION_EDIT,
    ITEM_ACTION_MOVE_TO_CATEGORY,
    ITEM_ACTION_INCREMENT,
    ITEM_ACTION_DECREMENT,
    ITEM_ACTION_REMOVE,
  ];
}
