import { ConfirmPromptModalInput } from '@app/common/components';
import * as listMenu from '../contextual-menus/list';
import * as categoryMenu from '../contextual-menus/category';
import * as itemMenu from '../contextual-menus/item';

export const LIST_REMOVE_PROMPT: ConfirmPromptModalInput = {
  action: listMenu.LIST_ACTION_REMOVE.id,
  title: 'inventory.prompt.allRemoveTitle',
  message: 'inventory.prompt.allRemoveMessage',
};

export const CATEGORY_REMOVE_PROMPT: ConfirmPromptModalInput = {
  action: categoryMenu.CATEGORY_ACTION_REMOVE.id,
  title: 'inventory.prompt.categoryRemoveTitle', // params: categoryName
  message: 'inventory.prompt.categoryRemoveMessage', // params: categoryName
};

export const ITEM_REMOVE_PROMPT: ConfirmPromptModalInput = {
  action: itemMenu.ITEM_ACTION_REMOVE.id,
  title: 'inventory.prompt.itemRemoveTitle', // params: itemName
  message: 'inventory.prompt.itemRemoveMessage', // params: itemName
};
