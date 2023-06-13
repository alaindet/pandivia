import { ConfirmPromptModalInput } from '@app/common/components';
import * as listMenu from '../contextual-menus/list';
import * as categoryMenu from '../contextual-menus/category';
import * as itemMenu from '../contextual-menus/item';

export const LIST_REMOVE_PROMPT: ConfirmPromptModalInput = {
  action: listMenu.LIST_ACTION_REMOVE.id,
  title: 'Remove list', // TODO: Translate
  message: 'Do you want to remove all items from the list?', // TODO: Translate
};

export const CATEGORY_REMOVE_PROMPT: ConfirmPromptModalInput = {
  action: categoryMenu.CATEGORY_ACTION_REMOVE.id,
  title: 'Remove list', // TODO: Translate
  message: 'Do you want to remove all items from the category?', // TODO: Translate
};

export const ITEM_REMOVE_PROMPT: ConfirmPromptModalInput = {
  action: itemMenu.ITEM_ACTION_REMOVE.id,
  title: 'Remove item', // TODO: Translate
  message: 'Do you want to remove this item?', // TODO: Translate
};
