import { BottomMenuItem } from '@ui/components';
import {
  matFormatListBulleted,
  matInventory2,
  matPerson,
} from '@ng-icons/material-icons/baseline';

export const NAVIGATION_ITEM_INVENTORY: BottomMenuItem = {
  id: 'inventory',
  icon: matInventory2,
  label: 'inventory.title',
};

export const NAVIGATION_ITEM_LIST: BottomMenuItem = {
  id: 'list',
  icon: matFormatListBulleted,
  label: 'list.title',
};

export const NAVIGATION_ITEM_USER: BottomMenuItem = {
  id: 'user',
  icon: matPerson,
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
