import { ListItem } from '@app/core';
import { ActionsMenuItem } from '@app/common/components';

// List actions ---------------------------------------------------------------
export const LIST_ACTION_TICK: ActionsMenuItem = {
  id: 'category:tick',
  icon: 'done',
  label: 'Tick all',
};

export const LIST_ACTION_DELETE: ActionsMenuItem = {
  id: 'category:delete',
  icon: 'delete',
  label: 'Delete all',
};

export const LIST_ACTIONS: ActionsMenuItem[] = [
  LIST_ACTION_TICK,
  LIST_ACTION_DELETE,
];


// Item actions ---------------------------------------------------------------
export const ITEM_ACTION_UNDO: ActionsMenuItem = {
  id: 'item:undo',
  icon: 'undo',
  label: 'Undo',
};

export const ITEM_ACTION_DELETE: ActionsMenuItem = {
  id: 'item:undo',
  icon: 'undo',
  label: 'Undo',
};

export const ITEM_ACTION_TICK: ActionsMenuItem = {
  id: 'item:tick',
  icon: 'done',
  label: 'Tick'
};

export function getItemContextualMenu(item: ListItem): ActionsMenuItem[] {

  if (item.isDone) {
    return [
      { id: 'item:undo', icon: 'undo', label: 'Undo' },
      { id: 'item:delete', icon: 'delete', label: 'Delete' },
    ];
  }

  return [
    { id: 'item:tick', icon: 'done', label: 'Tick' },
    { id: 'item:delete', icon: 'delete', label: 'Delete' },
  ];
}