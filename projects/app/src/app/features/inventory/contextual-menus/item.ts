import { ActionsMenuItem } from '@app/common/components';
import { InventoryItem } from '../types';

export const ITEM_ACTION_ADD_TO_LIST: ActionsMenuItem = {
  id: 'item:add-to-list',
  label: 'inventory.menu.addToList',
  icon: 'format_list_bulleted',
};

export const ITEM_ACTION_MOVE_TO_CATEGORY: ActionsMenuItem = {
  id: 'item:move-to-category',
  label: 'common.menu.moveToCategory',
  icon: 'low_priority',
};

export const ITEM_ACTION_EDIT: ActionsMenuItem = {
  id: 'item:edit',
  label: 'common.menu.edit',
  icon: 'edit',
};

export const ITEM_ACTION_REMOVE: ActionsMenuItem = {
  id: 'item:remove',
  label: 'common.menu.remove',
  icon: 'delete',
};

export function getItemContextualMenu(item: InventoryItem): ActionsMenuItem[] {
  return [
    ITEM_ACTION_ADD_TO_LIST,
    ITEM_ACTION_MOVE_TO_CATEGORY,
    ITEM_ACTION_EDIT,
    ITEM_ACTION_REMOVE,
  ];
}
