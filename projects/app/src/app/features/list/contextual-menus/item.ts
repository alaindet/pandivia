import { ActionsMenuItem } from '@app/common/components';
import { ListItem } from '../types';

export const ITEM_ACTION_COMPLETE: ActionsMenuItem = {
  id: 'item:complete',
  label: 'common.menu.complete',
  icon: 'check',
};

export const ITEM_ACTION_UNDO: ActionsMenuItem = {
  id: 'item:undo',
  label: 'common.menu.undo',
  icon: 'undo',
};

export const ITEM_ACTION_INCREMENT: ActionsMenuItem = {
  id: 'item:increment',
  label: 'common.menu.increment',
  icon: 'add_circle',
};

export const ITEM_ACTION_DECREMENT: ActionsMenuItem = {
  id: 'item:decrement',
  label: 'common.menu.decrement',
  icon: 'remove_circle',
};

export const ITEM_ACTION_EDIT: ActionsMenuItem = {
  id: 'item:edit',
  label: 'common.menu.edit',
  icon: 'edit',
};

export const ITEM_ACTION_MOVE_TO_CATEGORY: ActionsMenuItem = {
  id: 'item:move-to-category',
  label: 'common.menu.moveToCategory',
  icon: 'low_priority',
};

export const ITEM_ACTION_REMOVE: ActionsMenuItem = {
  id: 'item:remove',
  label: 'common.menu.remove',
  icon: 'delete',
};

export function getItemContextualMenu(item: ListItem): ActionsMenuItem[] {
  return [
    item.isDone
      ? ITEM_ACTION_UNDO
      : ITEM_ACTION_COMPLETE,
    ITEM_ACTION_EDIT,
    ITEM_ACTION_MOVE_TO_CATEGORY,
    ITEM_ACTION_INCREMENT,
    ITEM_ACTION_DECREMENT,
    ITEM_ACTION_REMOVE,
  ];
}
