import { InventoryItem } from '@app/core';
import { ActionsMenuItem } from '@app/common/components';

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

export function getItemContextualMenu(item: InventoryItem): ActionsMenuItem[] {
  return [
    ITEM_ACTION_EDIT,
    ITEM_ACTION_REMOVE,
  ];
}