import { ActionsMenuItem } from '@app/common/components';
import { ListItem } from '@app/core';

export const ITEM_ACTION_COMPLETE: ActionsMenuItem = {
  id: 'item:complete',
  label: 'Complete', // TODO: Translate
  icon: 'check',
};

export const ITEM_ACTION_UNDO: ActionsMenuItem = {
  id: 'item:undo',
  label: 'Undo', // TODO: Translate
  icon: 'undo',
};

export const ITEM_ACTION_INCREMENT: ActionsMenuItem = {
  id: 'item:increment',
  label: 'Increment +1', // TODO: Translate
  icon: 'add_circle',
};

export const ITEM_ACTION_DECREMENT: ActionsMenuItem = {
  id: 'item:decrement',
  label: 'Decrement -1', // TODO: Translate
  icon: 'remove_circle',
};

export const ITEM_ACTION_EDIT: ActionsMenuItem = {
  id: 'item:edit',
  label: 'Edit', // TODO: Translate
  icon: 'edit',
};

export const ITEM_ACTION_REMOVE: ActionsMenuItem = {
  id: 'item:remove',
  label: 'Remove', // TODO: Translate
  icon: 'delete',
};

export function getItemContextualMenu(item: ListItem): ActionsMenuItem[] {
  return [
    item.isDone ? ITEM_ACTION_UNDO : ITEM_ACTION_COMPLETE,
    ITEM_ACTION_EDIT,
    ITEM_ACTION_INCREMENT,
    ITEM_ACTION_DECREMENT,
    ITEM_ACTION_REMOVE,
  ];
}