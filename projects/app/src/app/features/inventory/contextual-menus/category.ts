import { ActionsMenuItem } from '@app/common/components';

export const CATEGORY_ACTION_CREATE_ITEM: ActionsMenuItem = {
  id: 'category:create-item',
  label: 'common.menu.createNewItem',
  icon: 'add_circle',
};

export const CATEGORY_ACTION_REMOVE: ActionsMenuItem = {
  id: 'category:remove',
  label: 'common.menu.removeAllItems',
  icon: 'delete',
};

export const CATEGORY_ACTION_ADD_TO_LIST: ActionsMenuItem = {
  id: 'category:clone',
  label: 'inventory.menu.addToList',
  icon: 'format_list_bulleted',
};

export const CATEGORY_CONTEXTUAL_MENU: ActionsMenuItem[] = [
  CATEGORY_ACTION_CREATE_ITEM,
  CATEGORY_ACTION_ADD_TO_LIST,
  CATEGORY_ACTION_REMOVE,
];
