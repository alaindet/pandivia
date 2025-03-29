import { ActionsMenuItem } from '@ui/components/actions-menu';
import {
  matAddCircle,
  matDelete,
  matFormatListBulleted,
} from '@ng-icons/material-icons/baseline';

export const CATEGORY_ACTION_CREATE_ITEM: ActionsMenuItem = {
  id: 'category:create-item',
  label: 'common.menu.createNewItem',
  icon: matAddCircle,
};

export const CATEGORY_ACTION_REMOVE: ActionsMenuItem = {
  id: 'category:remove',
  label: 'common.menu.removeAllItems',
  icon: matDelete,
};

export const CATEGORY_ACTION_ADD_TO_LIST: ActionsMenuItem = {
  id: 'category:clone',
  label: 'inventory.menu.addToList',
  icon: matFormatListBulleted,
};

export const CATEGORY_CONTEXTUAL_MENU: ActionsMenuItem[] = [
  CATEGORY_ACTION_CREATE_ITEM,
  CATEGORY_ACTION_ADD_TO_LIST,
  CATEGORY_ACTION_REMOVE,
];
