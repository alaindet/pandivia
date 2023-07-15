import { BottomMenuItem } from '@app/common/components';

export const NAVIGATION_ITEM_INVENTORY: BottomMenuItem = {
  id: 'inventory',
  icon: 'inventory_2',
  label: 'inventory.title',
};

export const NAVIGATION_ITEM_LIST: BottomMenuItem = {
  id: 'list',
  icon: 'format_list_bulleted',
  label: 'list.title',
};

export const NAVIGATION_ITEM_USER: BottomMenuItem = {
  id: 'user',
  icon: 'person',
  label: 'userProfile.title',
};

export const NAVIGATION_ITEMS: BottomMenuItem[] = [
  NAVIGATION_ITEM_INVENTORY,
  NAVIGATION_ITEM_LIST,
  NAVIGATION_ITEM_USER,
];

export const NAVIGATION_ROUTES = {
  [NAVIGATION_ITEM_INVENTORY.id]: '/inventory',
  [NAVIGATION_ITEM_LIST.id]: '/list',
  [NAVIGATION_ITEM_USER.id]: '/user/profile',
};
