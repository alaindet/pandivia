import { ListItem } from '@app/features/list';
import { ActionsMenuItem } from '@app/common/components';
import { matDelete, matDone, matUndo } from '@ng-icons/material-icons/baseline';

// List actions ---------------------------------------------------------------
export const LIST_ACTION_TICK: ActionsMenuItem = {
  id: 'category:tick',
  icon: matUndo,
  label: 'Tick all',
};

export const LIST_ACTION_DELETE: ActionsMenuItem = {
  id: 'category:delete',
  icon: matDelete,
  label: 'Delete all',
};

export const LIST_ACTIONS: ActionsMenuItem[] = [
  LIST_ACTION_TICK,
  LIST_ACTION_DELETE,
];

// Item actions ---------------------------------------------------------------
export const ITEM_ACTION_UNDO: ActionsMenuItem = {
  id: 'item:undo',
  icon: matDone,
  label: 'Undo',
};

export const ITEM_ACTION_DELETE: ActionsMenuItem = {
  id: 'item:undo',
  icon: matUndo,
  label: 'Undo',
};

export const ITEM_ACTION_TICK: ActionsMenuItem = {
  id: 'item:tick',
  icon: matDone,
  label: 'Tick',
};

export function getItemContextualMenu(item: ListItem): ActionsMenuItem[] {
  if (item.isDone) {
    return [
      { id: 'item:undo', icon: matUndo, label: 'Undo' },
      { id: 'item:delete', icon: matDelete, label: 'Delete' },
    ];
  }

  return [
    { id: 'item:tick', icon: matDone, label: 'Tick' },
    { id: 'item:delete', icon: matDelete, label: 'Delete' },
  ];
}
